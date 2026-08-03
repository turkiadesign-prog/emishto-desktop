// aster-film.jsx — scene components for "The Aster Vessel" catalogue film.
const IMAGES = {
  front: 'assets/aster/aster-01-front.png',
  front3q: 'assets/aster/aster-02-front-3q.png',
  side: 'assets/aster/aster-03-side.png',
  back: 'assets/aster/aster-04-back.png',
  opposite3q: 'assets/aster/aster-05-opposite-3q.png',
  neck: 'assets/aster/aster-06-neck-rim.png',
  handle: 'assets/aster/aster-07-handle.png',
  surface: 'assets/aster/aster-08-surface.png',
  base: 'assets/aster/aster-09-base.png',
};

const STAGE_W = 900;
const STAGE_H = 1160;

function fadeOpacity(localTime, dur, entryDur, exitDur) {
  const exitStart = Math.max(0, dur - exitDur);
  if (localTime < entryDur) return window.Easing.easeOutCubic(window.clamp(localTime / entryDur, 0, 1));
  if (localTime > exitStart) return 1 - window.Easing.easeInCubic(window.clamp((localTime - exitStart) / exitDur, 0, 1));
  return 1;
}

function kenBurnsScale(localTime, dur, entryDur, exitDur, targetScale) {
  const exitStart = Math.max(0, dur - exitDur);
  if (localTime < entryDur) return 1;
  if (localTime > exitStart) return targetScale;
  const holdSpan = exitStart - entryDur;
  const holdT = holdSpan > 0 ? window.clamp((localTime - entryDur) / holdSpan, 0, 1) : 0;
  return 1 + (targetScale - 1) * holdT;
}

function BaseView({ scene, localTime, dur }) {
  const entryDur = scene.name === 'Front' ? 0.9 : 0.5;
  const exitDur = 0.5;
  const imgOpacity = fadeOpacity(localTime, dur, entryDur, exitDur);
  const scale = kenBurnsScale(localTime, dur, entryDur, exitDur, 1.05);

  const captionEntry = 0.7, captionExit = 0.5;
  const captionOpacity = scene.caption ? fadeOpacity(localTime, dur, captionEntry, captionExit) : 0;
  const subOpacity = scene.sub ? fadeOpacity(localTime, dur, 0.9, captionExit) : 0;
  const labelOpacity = scene.label ? fadeOpacity(localTime, dur, 0.6, 0.4) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#1C1C1C' }}>
      <img
        src={IMAGES[scene.img]}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: imgOpacity,
          transform: `scale(${scale})`, transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      />
      {scene.caption ? (
        <div style={{
          position: 'absolute', left: '50%', top: STAGE_H - 132, transform: 'translateX(-50%)',
          opacity: captionOpacity, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 40, color: '#FBFAF8', textAlign: 'center', whiteSpace: 'pre',
        }}>{scene.caption}</div>
      ) : null}
      {scene.sub ? (
        <div style={{
          position: 'absolute', left: '50%', top: STAGE_H - 84, transform: 'translateX(-50%)',
          opacity: subOpacity, fontFamily: "'Gantari', sans-serif", fontWeight: 500,
          fontSize: 13, letterSpacing: '0.16em', color: 'rgba(251,250,248,0.62)',
          textAlign: 'center', whiteSpace: 'pre',
        }}>{scene.sub}</div>
      ) : null}
      {scene.label ? (
        <div style={{
          position: 'absolute', left: 48, top: STAGE_H - 64,
          opacity: labelOpacity, fontFamily: "'Gantari', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '0.22em', color: 'rgba(251,250,248,0.7)',
          whiteSpace: 'pre',
        }}>{scene.label.toUpperCase()}</div>
      ) : null}
    </div>
  );
}

window.AsterFilm = function AsterFilm() {
  const scenes = window.OM_SCENES;
  const playback = window.OM_PLAYBACK;
  return (
    <window.SceneStage width={STAGE_W} height={STAGE_H} scenes={scenes} playback={playback} bg="#1C1C1C">
      {{
        Front: BaseView,
        Front3Q: BaseView,
        Side: BaseView,
        Back: BaseView,
        Opposite3Q: BaseView,
        FrontReturn: BaseView,
        NeckZoom: BaseView,
        HandleZoom: BaseView,
        SurfaceZoom: BaseView,
        BaseZoom: BaseView,
        FrontFinal: BaseView,
      }}
    </window.SceneStage>
  );
};
