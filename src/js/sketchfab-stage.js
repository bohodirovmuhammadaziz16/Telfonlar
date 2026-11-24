/**
 * Sketchfab 3D Viewer & Interactive CSS 3D Stage Controller
 */

function hexToLinearRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  // Convert sRGB to linear space for Sketchfab PBR materials
  const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return [toLinear(r), toLinear(g), toLinear(b)];
}

export class PhoneStage3D {
  constructor(elements) {
    this.els = elements;
    this.api = null;
    this.currentUid = null;
    this.currentColor = null;
    this.activeCamMode = 'spin';
    this.isCss3dMode = false;
    this.spinTimer = null;
    this.orbitAngle = 0;
    this.dragState = { active: false, startX: 0, startY: 0, rotX: 6, rotY: -12 };

    this.bindCss3dPointerEvents();
  }

  loadModel(phone, color) {
    this.currentColor = color;
    this.applyStageColor(color);

    // Update CSS 3D card image & link
    this.els.css3dImage.src = phone.image;
    this.els.css3dImage.alt = `${phone.name} — ${color.name}`;
    this.els.sketchfabExternalLink.href = phone.sketchfabUrl;

    if (this.currentUid === phone.sketchfabUid && this.api) {
      this.applyColorToSketchfabMaterials(color);
      return;
    }

    this.currentUid = phone.sketchfabUid;
    this.api = null;
    this.stopSpinLoop();
    this.els.stageLoader.classList.remove('is-hidden');

    const frame = this.els.sketchfabFrame;
    const initViewer = () => {
      if (typeof window.Sketchfab !== 'function') {
        // Fallback: direct embed URL if Sketchfab SDK script didn't finish loading yet
        frame.src = `https://sketchfab.com/models/${phone.sketchfabUid}/embed?autostart=1&autospin=0.35&transparent=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_stop=0`;
        setTimeout(() => {
          this.els.stageLoader.classList.add('is-hidden');
        }, 1600);
        return;
      }

      const client = new window.Sketchfab('1.12.1', frame);
      client.init(phone.sketchfabUid, {
        autostart: 1,
        autospin: 0.35,
        transparent: 1,
        ui_theme: 'dark',
        ui_infos: 0,
        ui_controls: 1,
        ui_stop: 0,
        ui_watermark: 0,
        ui_hint: 0,
        ui_ar: 0,
        preload: 1,
        success: (api) => {
          this.api = api;
          api.start();
          api.addEventListener('viewerready', () => {
            this.els.stageLoader.classList.add('is-hidden');
            if (this.currentColor) {
              this.applyColorToSketchfabMaterials(this.currentColor);
            }
            this.setCameraPreset(this.activeCamMode);
          });
        },
        error: () => {
          this.els.stageLoader.classList.add('is-hidden');
        }
      });
    };

    // Wait briefly if deferred Sketchfab SDK is still loading
    if (typeof window.Sketchfab === 'function') {
      initViewer();
    } else {
      setTimeout(initViewer, 350);
    }
  }

  applyStageColor(color) {
    this.currentColor = color;
    document.documentElement.style.setProperty('--finish-rgb', color.rgb);
    this.applyColorToSketchfabMaterials(color);
  }

  applyColorToSketchfabMaterials(color) {
    if (!this.api || !color) return;
    const linear = hexToLinearRgb(color.hex);

    this.api.getMaterialList((err, materials) => {
      if (err || !Array.isArray(materials)) return;
      const skipKeywords = ['screen', 'display', 'glass', 'lens', 'camera', 'logo', 'wallpaper', 'glow', 'flash'];

      materials.forEach((mat) => {
        const lowerName = (mat.name || '').toLowerCase();
        const isChassis =
          lowerName.includes('body') ||
          lowerName.includes('back') ||
          lowerName.includes('frame') ||
          lowerName.includes('metal') ||
          lowerName.includes('titanium') ||
          lowerName.includes('aluminum') ||
          lowerName.includes('case') ||
          lowerName.includes('housing') ||
          lowerName.includes('chassis') ||
          lowerName.includes('side');

        const isExcluded = skipKeywords.some((kw) => lowerName.includes(kw));

        if (isChassis && !isExcluded && mat.channels && mat.channels.AlbedoPBR) {
          const updated = JSON.parse(JSON.stringify(mat));
          updated.channels.AlbedoPBR.color = linear;
          updated.channels.AlbedoPBR.enable = true;
          // Preserve texture if present, only tint color factor gently
          if (updated.channels.AlbedoPBR.texture) {
            updated.channels.AlbedoPBR.factor = 0.85;
          }
          this.api.setMaterial(updated, () => {});
        }
      });
    });
  }

  setCameraPreset(preset) {
    this.activeCamMode = preset;
    this.stopSpinLoop();

    if (this.isCss3dMode) {
      const phoneEl = this.els.css3dPhone;
      phoneEl.classList.remove('is-auto-spin');
      if (preset === 'spin') {
        phoneEl.classList.add('is-auto-spin');
      } else if (preset === 'front') {
        phoneEl.style.transform = 'rotateY(0deg) rotateX(0deg)';
      } else if (preset === 'camera') {
        phoneEl.style.transform = 'rotateY(18deg) rotateX(-10deg) scale(1.06)';
      } else if (preset === 'side') {
        phoneEl.style.transform = 'rotateY(-42deg) rotateX(4deg)';
      }
      return;
    }

    if (!this.api) return;

    this.api.getCameraLookAt((err, camera) => {
      if (err || !camera || !camera.target) return;
      const target = camera.target;
      const dx = camera.position[0] - target[0];
      const dy = camera.position[1] - target[1];
      const dz = camera.position[2] - target[2];
      const dist = Math.max(Math.hypot(dx, dy, dz), 0.5);

      if (preset === 'spin') {
        this.spinTimer = setInterval(() => {
          if (!this.api || this.activeCamMode !== 'spin') return;
          this.orbitAngle += 0.045;
          const pos = [
            target[0] + Math.sin(this.orbitAngle) * dist,
            target[1] - Math.cos(this.orbitAngle) * dist,
            target[2] + dist * 0.18
          ];
          this.api.setCameraLookAt(pos, target, 0.25);
        }, 120);
      } else if (preset === 'front') {
        this.api.setCameraLookAt([target[0], target[1] - dist, target[2] + dist * 0.06], target, 0.9);
      } else if (preset === 'camera') {
        this.api.setCameraLookAt([target[0] + dist * 0.45, target[1] + dist * 0.85, target[2] + dist * 0.35], target, 0.9);
      } else if (preset === 'side') {
        this.api.setCameraLookAt([target[0] + dist * 0.98, target[1] - dist * 0.15, target[2] + dist * 0.12], target, 0.9);
      }
    });
  }

  toggleViewMode() {
    this.isCss3dMode = !this.isCss3dMode;
    this.els.sketchfabWrap.hidden = this.isCss3dMode;
    this.els.css3dWrap.hidden = !this.isCss3dMode;
    this.els.toggleViewModeBtn.classList.toggle('is-active', this.isCss3dMode);
    this.els.toggleViewModeBtn.textContent = this.isCss3dMode ? 'Sketchfab 3D rejimi' : '3D Karta rejimi';
    this.setCameraPreset(this.activeCamMode);
  }

  stopSpinLoop() {
    if (this.spinTimer) {
      clearInterval(this.spinTimer);
      this.spinTimer = null;
    }
  }

  bindCss3dPointerEvents() {
    const wrap = this.els.css3dWrap;
    const phoneEl = this.els.css3dPhone;
    if (!wrap || !phoneEl) return;

    const onDown = (e) => {
      if (!this.isCss3dMode) return;
      this.dragState.active = true;
      this.dragState.startX = e.clientX;
      this.dragState.startY = e.clientY;
      phoneEl.classList.remove('is-auto-spin');
    };

    const onMove = (e) => {
      if (!this.dragState.active || !this.isCss3dMode) return;
      const dx = e.clientX - this.dragState.startX;
      const dy = e.clientY - this.dragState.startY;
      this.dragState.startX = e.clientX;
      this.dragState.startY = e.clientY;
      this.dragState.rotY = Math.max(-55, Math.min(55, this.dragState.rotY + dx * 0.45));
      this.dragState.rotX = Math.max(-30, Math.min(30, this.dragState.rotX - dy * 0.35));
      phoneEl.style.transform = `rotateY(${this.dragState.rotY}deg) rotateX(${this.dragState.rotX}deg)`;
    };

    const onUp = () => {
      this.dragState.active = false;
    };

    wrap.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
}
