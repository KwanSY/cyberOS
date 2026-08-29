import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { TextWithKeywords } from '../common/TextWithKeywords';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Lock,
  AudioWaveform,
  Activity,
  Mic,
} from 'lucide-react';

export const CyberPlayerApp: React.FC = () => {
  const audioTrack = useGameStore((s) => s.audioTrack);
  const hasDiscoveredAudioTrack = useGameStore((s) => s.hasDiscoveredAudioTrack);
  const isAudioPlaying = useGameStore((s) => s.isAudioPlaying);
  const audioPlaybackProgress = useGameStore((s) => s.audioPlaybackProgress);
  const currentSubtitleIndex = useGameStore((s) => s.currentSubtitleIndex);
  const playAudio = useGameStore((s) => s.playAudio);
  const pauseAudio = useGameStore((s) => s.pauseAudio);
  const seekAudio = useGameStore((s) => s.seekAudio);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceConnectedRef = useRef<boolean>(false);

  // Initialize Real Audio Player Element & Web Audio Analyser for voicemail_07.wav
  useEffect(() => {
    const audio = new Audio('/assets/audio/voicemail_07.wav');
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!audio) return;
      const currentSec = Math.floor(audio.currentTime);
      seekAudio(currentSec);

      if (audio.ended) {
        pauseAudio();
        seekAudio(0);
      }
    };

    const handleEnded = () => {
      pauseAudio();
      seekAudio(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [seekAudio, pauseAudio]);

  // Connect Audio to Web Audio Analyser for Real Frequency Visualizer
  const ensureAudioSource = () => {
    if (audioSourceConnectedRef.current || !audioRef.current) return;
    try {
      const audioCtx = soundService.initCtx();
      if (!audioCtx) return;

      const source = audioCtx.createMediaElementSource(audioRef.current);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;

      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      analyserRef.current = analyser;
      audioSourceConnectedRef.current = true;
    } catch (_) {
    }
  };

  // Synchronize Play / Pause state with Audio Element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudioPlaying && audioTrack.isUnlocked && hasDiscoveredAudioTrack) {
      ensureAudioSource();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [isAudioPlaying, audioTrack.isUnlocked, hasDiscoveredAudioTrack]);

  // Canvas Realtime Waveform Rendering (Powered by Real Audio Analyser & DSP)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderWave = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background grid line
      ctx.strokeStyle = 'rgba(6, 78, 59, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const analyser = analyserRef.current;
      const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 32);
      if (analyser && isAudioPlaying) {
        analyser.getByteFrequencyData(dataArray);
      }

      const numBars = 48;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;
        if (isAudioPlaying) {
          const freqValue = dataArray[i % dataArray.length] || 0;
          barHeight = Math.max(4, (freqValue / 255) * height * 0.9);
        } else {
          barHeight = 4;
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#10b981'); // Emerald 500
        grad.addColorStop(0.5, '#34d399'); // Emerald 400
        grad.addColorStop(1, '#059669'); // Emerald 600

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animFrameIdRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAudioPlaying]);

  const formatSeconds = (sec: number) => {
    const s = sec % 60;
    return `00:${s.toString().padStart(2, '0')}`;
  };

  const handleSeekToLine = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    seekAudio(time);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 font-sans text-xs select-none overflow-hidden h-full">
      {/* Player Header Bar */}
      <div className="bg-slate-900 border-b border-cyber-700/80 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AudioWaveform className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200 font-mono text-xs">
            CyberPlayer 2.0 (Forensic Voiceprint Analyzer)
          </span>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
            300Hz-3400Hz BANDPASS
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            STATUS:{' '}
            {!hasDiscoveredAudioTrack
              ? 'STANDBY (NO STREAM)'
              : audioTrack.isUnlocked
              ? isAudioPlaying
                ? 'PLAYING'
                : 'READY'
              : 'ENCRYPTED'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden bg-gradient-to-b from-slate-950 via-cyber-950 to-slate-950">
        {!hasDiscoveredAudioTrack ? (
          <div className="flex-1 bg-slate-900/40 border border-cyber-800 rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
              <AudioWaveform className="w-6 h-6 opacity-60" />
            </div>
            <div className="text-slate-300 font-bold text-sm">
              [NO AUDIO STREAM LOADED] 暂无装载的音频数据流
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-mono">
              CyberPlayer 处于待机监听状态。请在邮箱终端 (MailBox) 或系统中查阅并打开涉案音频附件以加载声纹流。
            </p>
          </div>
        ) : (
          <>
            {/* Track Title Banner */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-600/60 flex items-center justify-center text-emerald-400 shrink-0">
                  {audioTrack.isUnlocked ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <span>{audioTrack.title}</span>
                    {!audioTrack.isUnlocked && (
                      <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-700 font-mono">
                        待解密
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    格式: 16-bit PCM WAV / 单声道 / 取证工控偷录
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-base font-black text-emerald-400">
                  {formatSeconds(audioPlaybackProgress)} / {audioTrack.duration}
                </div>
                <div className="text-[10px] text-slate-500">时长: 42 秒</div>
              </div>
            </div>

            {/* Lock Warning or Spectrum Visualizer */}
            {!audioTrack.isUnlocked ? (
              <div className="flex-1 bg-slate-900/60 border-2 border-dashed border-amber-600/60 rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500 flex items-center justify-center text-amber-400">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-slate-200 font-bold text-sm">
                  [ENCRYPTED AUDIO PAYLOAD] 录音数据包受到 AES 密钥保护
                </div>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed font-mono">
                  请在 <span className="text-cyan-300 font-semibold">CyberTerminal</span> 终端中使用 <code className="bg-black/60 text-emerald-300 px-1.5 py-0.5 rounded">decrypt voicemail_07.enc -k [密钥]</code> 命令进行解密。
                </p>
              </div>
            ) : (
              <>
                {/* Canvas Spectrum Display */}
                <div className="h-28 bg-slate-900/90 border border-emerald-900/80 rounded-lg p-2 flex flex-col justify-between shadow-inner relative overflow-hidden">
                  <div className="flex justify-between items-center text-[10px] font-mono text-emerald-500/80 px-1">
                    <span>CH-1 FORENSIC AUDIO STREAM</span>
                    <span>DSP: 300Hz ~ 3.4kHz TELEPHONE BANDPASS</span>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={70}
                    className="w-full h-16 rounded"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-1">
                    <span>0 Hz</span>
                    <span>1 kHz</span>
                    <span>2 kHz</span>
                    <span>3.4 kHz</span>
                  </div>
                </div>

                {/* Subtitle / Dialogue Display Area (Synchronized with Transcript) */}
                <div className="flex-1 bg-slate-900/70 border border-cyber-700/80 rounded-lg p-3 overflow-y-auto space-y-2.5">
                  <div className="text-[11px] font-bold text-cyan-400 font-mono flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span>对白声纹字幕同步 (点击高亮词条可提取入词块库)</span>
                    <span className="text-slate-500">
                      {currentSubtitleIndex + 1} / {audioTrack.transcript.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {audioTrack.transcript.map((line, idx) => {
                      const isCurrent = idx === currentSubtitleIndex && isAudioPlaying;
                      const isSpeakerSu = line.speaker === '苏曼';
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSeekToLine(line.time)}
                          className={`p-2.5 rounded-lg transition-all cursor-pointer border ${
                            isCurrent
                              ? 'bg-emerald-950/80 border-emerald-500 shadow-md translate-x-1'
                              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`font-bold text-xs ${
                                isSpeakerSu ? 'text-cyan-300' : 'text-amber-400'
                              }`}
                            >
                              【{line.speaker}】
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {formatSeconds(line.time)}
                            </span>
                          </div>
                          <div className="text-xs text-slate-200 leading-relaxed font-serif">
                            <TextWithKeywords text={line.text} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Controls Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isAudioPlaying) {
                          pauseAudio();
                        } else {
                          playAudio();
                        }
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
                    >
                      {isAudioPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>暂停</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>播放录音</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        handleSeekToLine(0);
                        soundService.playKeyClick();
                      }}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="重新播放"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Scrub Bar */}
                  <div className="flex-1 mx-4 flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={audioTrack.durationSeconds}
                      value={audioPlaybackProgress}
                      onChange={(e) => handleSeekToLine(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 font-mono text-xs">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>80%</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
