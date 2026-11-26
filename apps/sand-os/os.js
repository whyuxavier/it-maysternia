/* =====================================================================
   Sand OS — спільна віртуальна операційна система ІТ-Майстерні.
   Використовують: apps/sand-os (Мій перший ПК), apps/fact-checker.
   Підключення: <script src="../sand-os/os.js"></script>
   const os = SandOS.boot(document.getElementById('os'), {key:'sandos', base:'../'});
   ===================================================================== */
(function(){
'use strict';
const VER='1.0';
/* ---------------- стилі ---------------- */
const CSS=`
.sos{position:fixed;inset:0;overflow:hidden;font-family:Nunito,system-ui,sans-serif;color:#3b3450;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;z-index:50}
.sos *{box-sizing:border-box}
:where(.sos) button{font:inherit;color:inherit;border:0;background:none;cursor:pointer;padding:0}
:where(.sos) input,:where(.sos) textarea{font:inherit;color:inherit;user-select:text;-webkit-user-select:text}
.sos svg{display:block}
.sos-wall{position:absolute;inset:0;transition:background .4s}
.sos-desk{position:absolute;left:0;right:0;top:0;bottom:52px}
.sos-icons{position:absolute;inset:0}
.sos-bar{position:absolute;left:0;right:0;bottom:0;height:52px;background:rgba(20,30,60,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);display:flex;align-items:center;gap:6px;padding:0 6px;z-index:9000;color:#fff}
.sos-bar>button,.sos-tray>button{height:42px;border-radius:9px;display:flex;align-items:center;justify-content:center;transition:background .15s}
.sos-bar>button:hover,.sos-tray>button:hover,.sos-bar>button.on{background:rgba(255,255,255,.16)}
.sos-startb{width:48px;flex:none}.sos-startb svg{width:26px;height:26px;transition:transform .2s}.sos-startb:active svg{transform:scale(.88)}
.sos-tasks{flex:1;display:flex;gap:4px;min-width:0;overflow:hidden}
.sos-task{height:42px;max-width:190px;min-width:0;padding:0 12px;border-radius:9px;background:rgba(255,255,255,.08);display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px;border-bottom:3px solid transparent;color:#fff}
.sos-task:hover{background:rgba(255,255,255,.16)}.sos-task.on{background:rgba(255,255,255,.22);border-bottom-color:#a9cfee}.sos-task.min{opacity:.7}
.sos-task i{width:26px;height:24px;flex:none}.sos-task i svg{width:100%;height:100%}.sos-task span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.sos-tray{display:flex;align-items:center;gap:2px;flex:none}
.sos-tray>button{padding:0 9px;font-weight:800;font-size:14px}
.sos-lang{min-width:44px;background:rgba(255,255,255,.12)!important}
.sos-clock{flex-direction:column;line-height:1.1;font-size:13px!important;text-align:right;align-items:flex-end!important}.sos-clock small{font-weight:600;opacity:.8;font-size:11px}
.sos-tray svg{width:20px;height:20px}
.sos-showd{width:8px!important;padding:0!important;border-left:1px solid rgba(255,255,255,.25);border-radius:0!important;margin-left:4px}
/* іконки */
.sos-it{position:absolute;width:100px;padding:6px 3px 7px;border-radius:10px;display:flex;flex-direction:column;align-items:center;gap:3px;color:#fff;font-weight:700;font-size:13.5px;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.85),0 0 6px rgba(0,0,0,.45);border:2px solid transparent;cursor:default;transition:left .2s,top .2s}
.sos-it .ic{width:58px;height:50px;pointer-events:none;display:grid;place-items:center}.sos-it .ic svg{width:100%;height:100%;max-height:50px}
.sos-it .nm{line-height:1.2;overflow-wrap:break-word;hyphens:auto;pointer-events:none;max-width:100%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sos-it:hover{background:rgba(255,255,255,.14)}
.sos-it.sel{background:rgba(160,210,255,.38);border-color:rgba(241,234,223,.9)}
.sos-it.cut{opacity:.5}
.sos-it.over,.sos-drop-over{background:rgba(255,226,122,.55)!important;border-color:#ffd23f!important}

.sos-arrow{position:absolute;left:4px;bottom:2px;width:16px;height:16px}
.sos-ghost{position:fixed;z-index:99999;pointer-events:none;opacity:.85;transform:translate(-50%,-60%) scale(.9)}
.sos-ghost .sos-it{position:static;background:rgba(160,210,255,.4)}
.sos-ghost b{position:absolute;right:6px;top:2px;background:#e07a6a;color:#fff;border-radius:10px;padding:0 6px;font-size:12px}
.sos-ren{width:100%;min-height:22px;font-size:13.5px;font-weight:700;text-align:center;border:2px solid #4f7fbf;border-radius:4px;color:#3b3450;background:#fff;outline:none;resize:none;padding:1px 2px;line-height:1.2;text-shadow:none}
.sos-refresh .sos-it{animation:sosBlink .35s}
@keyframes sosBlink{0%{opacity:1}40%{opacity:.1}100%{opacity:1}}
/* вікна */
.sw{position:absolute;display:flex;flex-direction:column;background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(20,25,60,.38),0 0 0 1px rgba(20,25,60,.12);overflow:hidden;min-width:260px;min-height:160px;animation:sosOpen .18s ease-out}
.sw.max{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0}
.sw.min{display:none}
.sw.closing{transform:scale(.9);opacity:0;transition:transform .16s,opacity .16s}
.sw.inactive .swt{background:#efeae2;color:#8a83a0}
@keyframes sosOpen{from{transform:scale(.92);opacity:0}to{transform:none;opacity:1}}
.swt{height:42px;flex:none;display:flex;align-items:center;gap:8px;padding-left:10px;background:#f7f1e8;font-weight:800;font-size:15px;touch-action:none}
.swt i{width:28px;height:24px;flex:none}.swt i svg{width:100%;height:100%}
.swt b{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:800}
.swt button{width:46px;height:42px;display:grid;place-items:center}
.swt button:hover{background:rgba(59,52,80,.1)}.swt button.x:hover{background:#e0574a;color:#fff}
.swt button svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}
.swb{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;background:#fff;user-select:none}
.swr{position:absolute;right:0;bottom:0;width:18px;height:18px;cursor:nwse-resize;touch-action:none;z-index:3}
.swr::after{content:'';position:absolute;right:4px;bottom:4px;width:8px;height:8px;border-right:2px solid #c9c1b4;border-bottom:2px solid #c9c1b4}
.sw.max .swr{display:none}
.sw iframe{border:0;width:100%;height:100%;flex:1;background:#fff}
.sw-shield{position:absolute;inset:0;z-index:2;display:none}.sos.dragging .sw-shield{display:block}
/* меню */
.sos-menu{position:fixed;z-index:99990;background:#fff;border-radius:10px;box-shadow:0 12px 34px rgba(20,30,60,.32),0 0 0 1px rgba(20,30,60,.08);padding:5px;min-width:220px;animation:sosOpen .12s;font-size:15px;color:#3b3450}
.sos-menu button{display:flex;align-items:center;gap:10px;width:100%;height:38px;padding:0 12px;border-radius:7px;text-align:left;font-weight:700}
.sos-menu button:hover,.sos-menu button.hl{background:#eef3fb}
.sos-menu button[disabled]{opacity:.4;pointer-events:none}
.sos-menu button i{width:22px;height:22px;flex:none}.sos-menu button i svg{width:100%;height:100%;fill:none;stroke:#3b3450;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.sos-menu button kbd{margin-left:auto;font:600 12px Nunito,sans-serif;color:#8a83a0;padding-left:16px}
.sos-menu button.sub::after{content:'›';margin-left:auto;font-size:20px;color:#8a83a0}
.sos-menu hr{border:0;border-top:1px solid #eee7dc;margin:4px 6px}
/* пуск */
.sos-start{position:absolute;left:8px;bottom:60px;width:min(560px,calc(100% - 16px));height:min(600px,calc(100% - 70px));background:rgba(250,248,252,.97);backdrop-filter:blur(18px);border-radius:14px;box-shadow:0 20px 60px rgba(20,25,60,.45);z-index:9500;display:flex;flex-direction:column;animation:sosUp .18s ease-out;overflow:hidden}
@keyframes sosUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}
.sos-sq{margin:16px 16px 6px;position:relative}
.sos-sq input{width:100%;height:44px;border-radius:22px;border:2px solid #e3dcf0;background:#fff;padding:0 16px 0 44px;font-size:16px;font-weight:700;outline:none}
.sos-sq input:focus{border-color:#7f86ee}
.sos-sq svg{position:absolute;left:14px;top:12px;width:20px;height:20px;fill:none;stroke:#8a83a0;stroke-width:2.4}
.sos-sbody{flex:1;overflow:auto;padding:4px 12px 12px}
.sos-sbody h4{margin:12px 6px 6px;font:800 14px Rubik,Nunito,sans-serif;color:#6f6787}
.sos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:4px}
.sos-app{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;border-radius:10px;font-weight:700;font-size:13px;text-align:center;line-height:1.15}
.sos-app:hover,.sos-app.hl{background:#e9eefb}
.sos-app i{width:46px;height:40px}.sos-app i svg{width:100%;height:100%}
.sos-row{display:flex;align-items:center;gap:12px;width:100%;padding:7px 10px;border-radius:9px;font-weight:700;text-align:left}
.sos-row:hover,.sos-row.hl{background:#e9eefb}.sos-row i{width:34px;height:30px;flex:none}.sos-row i svg{width:100%;height:100%}
.sos-row small{display:block;font-weight:600;color:#8a83a0;font-size:12px}
.sos-sfoot{height:58px;flex:none;border-top:1px solid #ece6f3;display:flex;align-items:center;gap:8px;padding:0 12px;background:rgba(255,255,255,.6)}
.sos-user{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:10px;font-weight:800;flex:1;min-width:0}
.sos-user:hover,.sos-pw:hover{background:#e9eefb}
.sos-user span{width:34px;height:34px;border-radius:50%;background:#bddcf3;display:grid;place-items:center;font:800 14px Rubik,sans-serif;flex:none}
.sos-user b{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.sos-pw{width:44px;height:44px;border-radius:10px;display:grid;place-items:center}.sos-pw svg{width:22px;height:22px;fill:none;stroke:#3b3450;stroke-width:2.4;stroke-linecap:round}
.sos-empty{padding:30px 10px;text-align:center;color:#8a83a0;font-weight:700}
/* спливаючі */
.sos-pop{position:absolute;right:8px;bottom:60px;z-index:9500;background:rgba(250,248,252,.97);backdrop-filter:blur(18px);border-radius:14px;box-shadow:0 20px 60px rgba(20,25,60,.45);padding:16px;animation:sosUp .18s ease-out;width:330px;max-width:calc(100% - 16px)}
.sos-bigtime{font:800 38px Rubik,Nunito,sans-serif}.sos-bigdate{font-weight:700;color:#6f6787;margin-bottom:10px}.sos-bigdate::first-letter{text-transform:uppercase}
.sos-cal{user-select:none}
.sos-cal .hd{display:flex;align-items:center;gap:6px;margin-bottom:6px}.sos-cal .hd b{flex:1;font:800 16px Rubik,sans-serif;text-transform:capitalize}
.sos-cal .hd button{width:34px;height:34px;border-radius:8px;font-size:18px;font-weight:800}.sos-cal .hd button:hover{background:#e9eefb}
.sos-cal .g{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center}
.sos-cal .g span{font-size:12px;font-weight:800;color:#8a83a0;padding:4px 0}
.sos-cal .g button{aspect-ratio:1;border-radius:50%;font-weight:700;font-size:14px}
.sos-cal .g button:hover{background:#e9eefb}.sos-cal .g button.o{color:#c4bdd3}.sos-cal .g button.we{color:#e07a6a}.sos-cal .g button.t{background:#7f86ee;color:#fff}
.sos-toasts{position:absolute;right:10px;bottom:62px;z-index:9400;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none}
.sos-toast{pointer-events:auto;width:320px;max-width:calc(100vw - 20px);background:rgba(250,248,252,.98);border-radius:12px;box-shadow:0 12px 34px rgba(20,25,60,.35);padding:12px 14px;display:flex;gap:12px;align-items:flex-start;animation:sosIn .25s ease-out}
@keyframes sosIn{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}}
.sos-toast i{width:36px;height:32px;flex:none}.sos-toast i svg{width:100%;height:100%}.sos-toast b{display:block;font-size:15px}.sos-toast p{margin:2px 0 0;font-size:13.5px;color:#6f6787;font-weight:600}
.sos-toast .act{margin-top:6px;color:#4f6fd6;font-weight:800;font-size:14px}
/* діалог */
.sos-modal{position:absolute;inset:0 0 52px;z-index:9800;display:grid;place-items:center;background:rgba(20,25,50,.25)}
.sos-dlg{width:min(430px,calc(100% - 24px));background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(20,25,60,.45);overflow:hidden;animation:sosOpen .15s}
.sos-dlg .swt{cursor:default}
.sos-dlg .db{display:flex;gap:14px;padding:18px 18px 8px;align-items:flex-start;font-weight:700;font-size:15.5px;line-height:1.4}
.sos-dlg .db>i{width:44px;height:40px;flex:none}.sos-dlg .db>i svg{width:100%;height:100%}
.sos-dlg .db input{width:100%;height:40px;border:2px solid #dcd5e8;border-radius:8px;padding:0 10px;font-size:15px;font-weight:700;outline:none;margin-top:8px}
.sos-dlg .db input:focus{border-color:#7f86ee}
.sos-dlg .df{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px 16px}
.sos-btn{white-space:nowrap;flex:none;height:38px;padding:0 18px;border-radius:9px;background:#f1edf6!important;font-weight:800!important;font-size:14.5px}
.sos-btn:hover{background:#e6e0f0!important}.sos-btn.p{background:#7f86ee!important;color:#fff!important}.sos-btn.p:hover{background:#6c74e6!important}.sos-btn.d{background:#e0574a!important;color:#fff!important}
.sos-btn:focus-visible{outline:3px solid #a9cfee;outline-offset:2px}
/* провідник */
.sx-tool{height:48px;flex:none;display:flex;align-items:center;gap:4px;padding:0 8px;border-bottom:1px solid #efe8dd;background:#fbf8f3}
.sx-tool>button{height:36px;min-width:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;gap:6px;padding:0 8px;font-weight:700;font-size:14px}
.sx-tool>button:hover{background:#efe8dd}.sx-tool>button[disabled]{opacity:.35;pointer-events:none}
.sx-tool svg{width:18px;height:18px;fill:none;stroke:#3b3450;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.sx-addr{flex:1;min-width:0;height:34px;border:1px solid #e3dcd0;border-radius:8px;background:#fff;display:flex;align-items:center;padding:0 6px;overflow:hidden;font-weight:700;font-size:14px;white-space:nowrap}
.sx-addr button{padding:3px 6px;border-radius:5px;font-weight:700}.sx-addr button:hover{background:#eef3fb}.sx-addr span{color:#b3a796;padding:0 1px}
.sx-main{flex:1;display:flex;min-height:0}
.sx-side{width:180px;flex:none;border-right:1px solid #efe8dd;padding:8px 6px;overflow:auto;background:#fdfbf8}
.sx-side button{display:flex;align-items:center;gap:8px;width:100%;padding:6px 8px;border-radius:7px;font-weight:700;font-size:14px;text-align:left}
.sx-side button:hover{background:#eef3fb}.sx-side button.on{background:#dde8fa}
.sx-side i{width:24px;height:20px;flex:none}.sx-side i svg{width:100%;height:100%}
.sx-side hr{border:0;border-top:1px solid #efe8dd;margin:6px}
.sx-view{flex:1;position:relative;overflow:auto;padding:10px;min-width:0}
.sx-view .sos-it{position:relative;display:inline-flex;vertical-align:top;color:#3b3450;text-shadow:none;margin:2px;width:96px}
.sx-view .sos-it:hover{background:#eef3fb}.sx-view .sos-it.sel{background:#d6e6fb;border-color:#a9cfee}
.sx-view .sos-ren{border-color:#4f7fbf}
.sx-status{height:28px;flex:none;border-top:1px solid #efe8dd;font-size:13px;font-weight:700;color:#8a83a0;display:flex;align-items:center;padding:0 12px;background:#fbf8f3}
.sx-drives{display:flex;flex-wrap:wrap;gap:12px;padding:6px}
.sx-drive{display:flex;gap:12px;align-items:center;width:300px;padding:10px;border-radius:10px;border:2px solid transparent;text-align:left}
.sx-drive:hover{background:#eef3fb}.sx-drive.sel{background:#d6e6fb;border-color:#a9cfee}
.sx-drive i{width:56px;height:46px;flex:none}.sx-drive i svg{width:100%;height:100%}
.sx-drive b{display:block;font-size:15px}.sx-drive small{font-size:12.5px;color:#6f6787;font-weight:700}
.sx-meter{height:12px;border-radius:6px;background:#e9e3da;margin:4px 0 2px;overflow:hidden;width:200px}.sx-meter i{display:block;height:100%;width:0;background:#6fa6d6;border-radius:6px}
.sx-h{font:800 14px Rubik,Nunito,sans-serif;color:#6f6787;margin:8px 6px}
.sx-band{position:absolute;border:1px solid #6fa6d6;background:rgba(111,166,214,.18);pointer-events:none;z-index:5}
/* блокнот */
.sm-bar{height:34px;flex:none;display:flex;align-items:center;gap:2px;padding:0 6px;border-bottom:1px solid #efe8dd;background:#fbf8f3;font-size:14px}
.sm-bar>button{height:28px;padding:0 10px;border-radius:6px;font-weight:700}.sm-bar>button:hover,.sm-bar>button.on{background:#efe8dd}
.sn-ta{flex:1;border:0;outline:none;resize:none;padding:12px 14px;font:600 17px/1.5 Nunito,sans-serif;color:#2f2a4a;background:#fff;user-select:text;-webkit-user-select:text}
.sn-st{height:26px;flex:none;border-top:1px solid #efe8dd;font-size:12.5px;font-weight:700;color:#8a83a0;display:flex;align-items:center;gap:18px;padding:0 12px;background:#fbf8f3}
/* малювалка */
.sp-tools{flex:none;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid #efe8dd;background:#fbf8f3}
.sp-tools .grp{display:flex;gap:3px;align-items:center;padding-right:8px;border-right:1px solid #e6ded1}
.sp-tools .grp:last-child{border:0}
.sp-tools button.t{width:38px;height:38px;border-radius:8px;display:grid;place-items:center}
.sp-tools button.t:hover{background:#efe8dd}.sp-tools button.t.on{background:#dde8fa;box-shadow:inset 0 0 0 2px #7f9fe0}
.sp-tools button.t svg{width:22px;height:22px;fill:none;stroke:#3b3450;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.sp-tools .sz i{display:block;background:#3b3450;border-radius:50%}
.sp-col{width:24px;height:24px;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18)}
.sp-col.on{outline:3px solid #7f86ee;outline-offset:1px}
.sp-cur{width:34px;height:34px;border-radius:8px;box-shadow:inset 0 0 0 2px rgba(0,0,0,.2);position:relative;overflow:hidden}
.sp-cur input{position:absolute;inset:-6px;width:50px;height:50px;opacity:0;cursor:pointer}
.sp-area{flex:1;overflow:auto;background:#dfe3ee;display:grid;place-items:center;padding:14px;min-height:0}
.sp-wrap{position:relative;box-shadow:0 4px 16px rgba(20,25,60,.2);line-height:0}
.sp-wrap canvas{display:block;max-width:100%;touch-action:none;cursor:crosshair}
.sp-wrap canvas+canvas{position:absolute;left:0;top:0;pointer-events:none}
/* фото */
.sf-v{flex:1;display:grid;place-items:center;background:#2a2838;overflow:auto;padding:10px;min-height:0}
.sf-v img{max-width:100%;max-height:100%;box-shadow:0 6px 24px rgba(0,0,0,.4);background:#fff}
/* калькулятор */
.sc{flex:1;display:flex;flex-direction:column;padding:10px;gap:8px;background:#f4f1f8}
.sc-d{height:86px;border-radius:10px;background:#fff;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-end;padding:8px 14px;overflow:hidden}
.sc-d small{color:#8a83a0;font-weight:700;font-size:14px;min-height:18px}.sc-d b{font:800 34px Rubik,Nunito,sans-serif;white-space:nowrap}
.sc-k{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.sc-k button{border-radius:9px;background:#fff;font:800 20px Rubik,Nunito,sans-serif;box-shadow:0 2px 0 #e1dbe9;min-height:44px}
.sc-k button:hover{background:#f0ecf7}.sc-k button.op{background:#e9e4f5}.sc-k button.eq{background:#7f86ee;color:#fff}
/* браузер */
.sb-bar{height:46px;flex:none;display:flex;align-items:center;gap:4px;padding:0 8px;background:#f1eef6;border-bottom:1px solid #e3dcef}
.sb-bar button{width:36px;height:36px;border-radius:50%;display:grid;place-items:center}.sb-bar button:hover{background:#e3dcef}.sb-bar button[disabled]{opacity:.35;pointer-events:none}
.sb-bar svg{width:18px;height:18px;fill:none;stroke:#3b3450;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.sb-url{flex:1;min-width:0;height:34px;border-radius:17px;border:2px solid transparent;background:#fff;padding:0 14px 0 34px;font-size:14.5px;font-weight:700;outline:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236aae8a' stroke-width='2.6'%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Cpath d='M8 11V8a4 4 0 0 1 8 0v3'/%3E%3C/svg%3E");background-repeat:no-repeat;background-size:16px;background-position:12px center}
.sb-url:focus{border-color:#7f86ee}
.sb-page{flex:1;overflow:auto;background:#fff;user-select:text;-webkit-user-select:text;position:relative}
.sb-load{position:absolute;left:0;top:0;height:3px;background:#7f86ee;width:0;z-index:2;transition:width .35s}
.sb-in{max-width:760px;margin:0 auto;padding:26px 22px 40px;font-size:16px;line-height:1.55}
.sb-in h1{font:800 30px Rubik,Nunito,sans-serif;margin:0 0 10px}.sb-in h2{font:800 21px Rubik,Nunito,sans-serif;margin:22px 0 8px}
.sb-in a,.sb-in [data-go]{color:#4f5fd6;font-weight:800;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.sb-in .lead{color:#6f6787;font-weight:700}
.sb-logo{font:900 44px Rubik,Nunito,sans-serif;text-align:center;margin:40px 0 18px;letter-spacing:-1px}
.sb-logo span:nth-child(1){color:#6c74e6}.sb-logo span:nth-child(2){color:#e07a6a}.sb-logo span:nth-child(3){color:#e8b93a}.sb-logo span:nth-child(4){color:#5fae84}
.sb-sform{display:flex;gap:8px;max-width:560px;margin:0 auto 22px}
.sb-sform input{flex:1;height:48px;border-radius:24px;border:2px solid #dcd5e8;padding:0 20px;font-size:17px;font-weight:700;outline:none}.sb-sform input:focus{border-color:#7f86ee}
.sb-sform button{height:48px;padding:0 22px;border-radius:24px;background:#7f86ee;color:#fff;font-weight:800}
.sb-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;max-width:620px;margin:0 auto}
.sb-tiles button{text-decoration:none!important;color:#3b3450!important;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 6px;border-radius:14px;background:#f6f3fa;font-weight:800;font-size:14px}
.sb-tiles button:hover{background:#ebe5f5}.sb-tiles i{width:46px;height:40px}.sb-tiles i svg{width:100%;height:100%}
.sb-res{margin:0 0 18px}.sb-res small{display:block;color:#5fae84;font-weight:700;font-size:13px}.sb-res p{margin:2px 0 0;color:#6f6787;font-size:14.5px}
.sb-card{display:flex;gap:14px;align-items:center;padding:14px;border-radius:14px;background:#f6f3fa;margin:10px 0}
.sb-card .pv{width:120px;height:72px;border-radius:10px;flex:none}
.sb-card b{display:block}.sb-card p{margin:2px 0 0;color:#6f6787;font-size:14px}
.sb-card button{margin-left:auto;height:40px;padding:0 16px;border-radius:20px;background:#7f86ee;color:#fff;font-weight:800;flex:none}
.sb-wx{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
.sb-wx div{background:#eef5fd;border-radius:14px;padding:10px;text-align:center;font-weight:800}.sb-wx svg{width:44px;height:44px;margin:4px auto}
.sb-404{text-align:center;padding:50px 20px;color:#6f6787}.sb-404 svg{width:110px;height:110px;margin:0 auto 10px}
/* налаштування */
.ss{flex:1;display:flex;min-height:0}
.ss-nav{width:190px;flex:none;background:#f6f3fa;padding:10px 8px;border-right:1px solid #ece6f3}
.ss-nav button{display:flex;align-items:center;gap:10px;width:100%;padding:9px 10px;border-radius:8px;font-weight:800;font-size:14.5px;text-align:left}
.ss-nav button:hover{background:#ebe5f5}.ss-nav button.on{background:#dde3fb}
.ss-nav svg{width:20px;height:20px;fill:none;stroke:#3b3450;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.ss-body{flex:1;overflow:auto;padding:18px 22px}
.ss-body h2{font:800 22px Rubik,Nunito,sans-serif;margin:0 0 14px}
.ss-walls{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}
.ss-walls button{aspect-ratio:16/10;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}.ss-walls button.on{outline:4px solid #7f86ee;outline-offset:2px}
.ss-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;background:#f8f6fb;margin-bottom:8px;font-weight:700}
.ss-row>div{flex:1}.ss-row small{display:block;color:#8a83a0;font-weight:600;font-size:13px}
.ss-sw{width:52px;height:30px;border-radius:15px;background:#d6d0e0;position:relative;transition:background .2s;flex:none}
.ss-sw::after{content:'';position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}
.ss-sw.on{background:#7f86ee}.ss-sw.on::after{left:25px}
.ss-seg{display:flex;background:#ece6f3;border-radius:10px;padding:3px}.ss-seg button{padding:6px 14px;border-radius:8px;font-weight:800}.ss-seg button.on{background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.ss-meter{height:16px;border-radius:8px;background:#e9e3da;overflow:hidden;margin:8px 0}.ss-meter i{display:block;height:100%;background:#6fa6d6}
/* завантаження */
.sos-boot{position:absolute;inset:0;z-index:99995;background:#141a33;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;color:#fff;transition:opacity .4s}
.sos-boot svg{width:84px;height:84px}
.sos-boot .dots{display:flex;gap:8px}.sos-boot .dots i{width:10px;height:10px;border-radius:50%;background:#a9cfee;animation:sosDot 1s infinite}
.sos-boot .dots i:nth-child(2){animation-delay:.15s}.sos-boot .dots i:nth-child(3){animation-delay:.3s}
.sos-boot b{font:800 20px Rubik,Nunito,sans-serif;opacity:.9}
@keyframes sosDot{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-6px)}}

/* екран блокування і входу */
.sos-lock{position:absolute;inset:0;z-index:99990;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.25);cursor:default;transition:opacity .35s}
.sos-lock::before{content:'';position:absolute;inset:0;background:inherit;filter:none;z-index:-1}
.sos-lock .lt{position:absolute;left:0;right:0;top:16%;text-align:center;transition:transform .4s,opacity .4s}
.sos-lock .lt b{display:block;font:700 clamp(72px,12vw,120px)/1 Rubik,Nunito,sans-serif;letter-spacing:-2px}
.sos-lock .lt span{display:block;font:700 clamp(18px,2.6vw,26px) Nunito,sans-serif;margin-top:10px}.sos-lock .lt span::first-letter{text-transform:uppercase}
.sos-lock .hint{position:absolute;bottom:9%;left:0;right:0;text-align:center;font-weight:800;font-size:16px;opacity:.9;animation:sosHint 2s ease-in-out 3}
@keyframes sosHint{50%{transform:translateY(-6px)}}
.sos-lock.login .lt{transform:translateY(-40px);opacity:0;pointer-events:none}.sos-lock.login .hint{display:none}
.sos-lock.login{backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background-color:rgba(20,25,60,.25)}
.sos-login{display:none;flex-direction:column;align-items:center;gap:14px;animation:sosUp .35s ease-out}
.sos-lock.login .sos-login{display:flex}
.sos-av{width:128px;height:128px;border-radius:50%;background:rgba(255,255,255,.9);display:grid;place-items:center;font:800 46px Rubik,sans-serif;color:#4c5482;box-shadow:0 10px 30px rgba(0,0,0,.25);text-shadow:none}
.sos-av svg{width:70px;height:70px}
.sos-login h2{margin:0;font:800 28px Rubik,Nunito,sans-serif}
.sos-login small{font-weight:700;opacity:.9;font-size:15px;margin-top:-8px}
.sos-go{display:flex;align-items:center;gap:10px;height:48px;padding:0 22px 0 28px!important;outline:none;border-radius:24px;background:rgba(255,255,255,.92)!important;color:#3b3450!important;font:800 17px Nunito,sans-serif!important;text-shadow:none;box-shadow:0 6px 20px rgba(0,0,0,.2)}
.sos-go:hover{background:#fff!important}.sos-go:focus-visible{box-shadow:0 0 0 4px rgba(255,255,255,.55),0 6px 20px rgba(0,0,0,.2)}.sos-go svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round}
.sos-sw{font:800 15px Nunito,sans-serif!important;color:#fff!important;opacity:.9;text-decoration:underline;text-underline-offset:4px;padding:6px 10px!important}
.sos-lock .corner{position:absolute;right:18px;bottom:18px;display:flex;gap:8px}
.sos-lock .corner button{width:46px;height:46px;border-radius:12px;background:rgba(255,255,255,.18)!important;display:grid;place-items:center;color:#fff!important}
.sos-lock .corner button:hover{background:rgba(255,255,255,.3)!important}.sos-lock .corner svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
.sos-welcome{font:800 30px Rubik,Nunito,sans-serif}
.sos-off{position:absolute;inset:0;z-index:99996;background:#0c1024;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;color:#8f97c0;font-weight:800}
.sos-off button{width:96px;height:96px;border-radius:50%;background:#1c2346!important;color:#a9cfee!important;display:grid;place-items:center;box-shadow:0 0 0 3px #2b3466}
.sos-off button:hover{box-shadow:0 0 0 3px #a9cfee}.sos-off svg{width:44px;height:44px;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round}
@media (prefers-reduced-motion:reduce){.sos *{animation-duration:.01s!important;transition-duration:.01s!important}}
@media (max-width:700px){
 .sos-task span{display:none}.sos-task{padding:0 8px}.sos-clock small{display:none}
 .sx-side{display:none}.ss-nav{width:60px}.ss-nav button span{display:none}
 .sos-it{width:80px;font-size:12.5px}.sos-it .ic{width:50px;height:44px}
 .swt button{width:42px}
}`;

/* ---------------- іконки ---------------- */
const I={
 folder:`<svg viewBox="0 0 100 80"><path d="M6 16a6 6 0 0 1 6-6h24l8 8h44a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill="#e8c25a"/><path d="M6 30h88v40a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill="#f6dc8a"/></svg>`,
 txt:`<svg viewBox="0 0 64 56"><path d="M14 3h26l12 12v38H14z" fill="#fff" stroke="#6f6787" stroke-width="3" stroke-linejoin="round"/><path d="M40 3v12h12" fill="#e9e0d2" stroke="#6f6787" stroke-width="3" stroke-linejoin="round"/><path d="M20 26h26M20 34h26M20 42h18" stroke="#b3a796" stroke-width="3" stroke-linecap="round"/></svg>`,
 img:`<svg viewBox="0 0 64 56"><rect x="6" y="4" width="52" height="48" rx="7" fill="#fff" stroke="#6fa6d6" stroke-width="3"/><circle cx="22" cy="19" r="6" fill="#f3cf6b"/><path d="M10 48l15-17 10 10 7-7 13 14z" fill="#8fcfac"/></svg>`,
 unknown:`<svg viewBox="0 0 64 56"><path d="M14 3h26l12 12v38H14z" fill="#fff" stroke="#b3a796" stroke-width="3" stroke-linejoin="round"/><path d="M40 3v12h12" fill="#e9e0d2" stroke="#b3a796" stroke-width="3"/><text x="33" y="42" text-anchor="middle" font-family="Rubik,sans-serif" font-weight="800" font-size="20" fill="#b3a796">?</text></svg>`,
 bin:`<svg viewBox="0 0 64 56"><path d="M16 17h32l-3 36H19z" fill="#cfe6ff" stroke="#4f7fbf" stroke-width="3" stroke-linejoin="round"/><rect x="12" y="11" width="40" height="7" rx="3" fill="#4f7fbf"/><path d="M26 23v24M32 23v24M38 23v24" stroke="#4f7fbf" stroke-width="2.5"/></svg>`,
 binFull:`<svg viewBox="0 0 64 56"><path d="M20 14l7-11 6 7 8-7 4 11z" fill="#fff" stroke="#b3a796" stroke-width="2" stroke-linejoin="round"/><path d="M16 17h32l-3 36H19z" fill="#cfe6ff" stroke="#4f7fbf" stroke-width="3" stroke-linejoin="round"/><rect x="12" y="11" width="40" height="7" rx="3" fill="#4f7fbf"/><path d="M26 23v24M32 23v24M38 23v24" stroke="#4f7fbf" stroke-width="2.5"/></svg>`,
 pc:`<svg viewBox="0 0 64 56"><rect x="5" y="5" width="54" height="36" rx="5" fill="#2f3a66"/><rect x="9" y="9" width="46" height="28" rx="2" fill="url(#sosPcG)"/><defs><linearGradient id="sosPcG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fb6f2"/><stop offset="1" stop-color="#a98cf0"/></linearGradient></defs><path d="M26 41h12l2 8H24z" fill="#8a93b8"/><rect x="18" y="48" width="28" height="4" rx="2" fill="#5f6890"/></svg>`,
 drive:`<svg viewBox="0 0 64 56"><rect x="6" y="16" width="52" height="26" rx="6" fill="#e6e9f2" stroke="#7a84a8" stroke-width="3"/><rect x="12" y="30" width="22" height="4" rx="2" fill="#7a84a8"/><circle cx="48" cy="32" r="3" fill="#5fae84"/><path d="M14 16l6-8h24l6 8" fill="#f3f4f8" stroke="#7a84a8" stroke-width="3" stroke-linejoin="round"/></svg>`,
 web:`<svg viewBox="0 0 64 56"><circle cx="32" cy="28" r="24" fill="#eaf3fd" stroke="#4f8fd6" stroke-width="3"/><path d="M8 28h48M32 4c-10 12-10 36 0 48M32 4c10 12 10 36 0 48M12 16h40M12 40h40" stroke="#4f8fd6" stroke-width="2.6" fill="none"/></svg>`,
 notepad:`<svg viewBox="0 0 64 56"><rect x="12" y="6" width="40" height="46" rx="5" fill="#fff" stroke="#6fa6d6" stroke-width="3"/><path d="M18 2v8M28 2v8M38 2v8M46 2v8" stroke="#4f7fbf" stroke-width="3" stroke-linecap="round"/><path d="M19 22h26M19 30h26M19 38h16" stroke="#b3a796" stroke-width="3" stroke-linecap="round"/></svg>`,
 paint:`<svg viewBox="0 0 64 56"><path d="M32 4C16 4 5 15 5 28s10 24 22 24c5 0 6-3 5-6s0-7 5-7h8c8 0 14-5 14-13C59 14 47 4 32 4z" fill="#fff4dc" stroke="#d4a540" stroke-width="3"/><circle cx="18" cy="26" r="5" fill="#e07a6a"/><circle cx="26" cy="15" r="5" fill="#f3cf6b"/><circle cx="39" cy="14" r="5" fill="#6fb38f"/><circle cx="48" cy="24" r="5" fill="#6fa6d6"/></svg>`,
 photo:`<svg viewBox="0 0 64 56"><rect x="6" y="8" width="52" height="42" rx="7" fill="#fff" stroke="#e07a6a" stroke-width="3"/><circle cx="22" cy="22" r="6" fill="#f3cf6b"/><path d="M10 46l15-15 9 9 8-8 14 14z" fill="#f2b3c6"/></svg>`,
 calc:`<svg viewBox="0 0 64 56"><rect x="14" y="3" width="36" height="50" rx="6" fill="#4c5482"/><rect x="19" y="8" width="26" height="11" rx="2" fill="#bfe3cf"/><g fill="#fff"><rect x="19" y="24" width="7" height="6" rx="1.5"/><rect x="28.5" y="24" width="7" height="6" rx="1.5"/><rect x="38" y="24" width="7" height="6" rx="1.5" fill="#f3cf6b"/><rect x="19" y="33" width="7" height="6" rx="1.5"/><rect x="28.5" y="33" width="7" height="6" rx="1.5"/><rect x="38" y="33" width="7" height="6" rx="1.5" fill="#f3cf6b"/><rect x="19" y="42" width="7" height="6" rx="1.5"/><rect x="28.5" y="42" width="7" height="6" rx="1.5"/><rect x="38" y="42" width="7" height="6" rx="1.5" fill="#e07a6a"/></g></svg>`,
 cal:`<svg viewBox="0 0 64 56"><rect x="8" y="8" width="48" height="44" rx="7" fill="#fff" stroke="#e07a6a" stroke-width="3"/><path d="M8 15a7 7 0 0 1 7-7h34a7 7 0 0 1 7 7v7H8z" fill="#e07a6a"/><path d="M20 3v10M44 3v10" stroke="#3b3450" stroke-width="3.5" stroke-linecap="round"/><text x="32" y="45" text-anchor="middle" font-family="Rubik,sans-serif" font-weight="800" font-size="18" fill="#3b3450">${new Date().getDate()}</text></svg>`,
 settings:`<svg viewBox="0 0 64 56"><circle cx="32" cy="28" r="22" fill="#e9e4f5"/><path d="M32 12l4 4 6-1 1 6 5 3-3 5 3 5-5 3-1 6-6-1-4 4-4-4-6 1-1-6-5-3 3-5-3-5 5-3 1-6 6 1z" fill="#7a84a8"/><circle cx="32" cy="28" r="7" fill="#e9e4f5"/></svg>`,
 lnk:`<svg viewBox="0 0 16 16"><rect x=".5" y=".5" width="15" height="15" rx="3" fill="#fff" stroke="#8a93b8"/><path d="M5 11l5-5M6 5.5h4.5V10" stroke="#3b6fd6" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 warn:`<svg viewBox="0 0 64 56"><path d="M32 4l28 48H4z" fill="#f6dc8a" stroke="#d4a540" stroke-width="3" stroke-linejoin="round"/><path d="M32 20v15" stroke="#3b3450" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="43" r="3" fill="#3b3450"/></svg>`,
 info:`<svg viewBox="0 0 64 56"><circle cx="32" cy="28" r="24" fill="#d9ecff" stroke="#4f8fd6" stroke-width="3"/><path d="M32 25v16" stroke="#3b3450" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="16" r="3.4" fill="#3b3450"/></svg>`,
 ask:`<svg viewBox="0 0 64 56"><circle cx="32" cy="28" r="24" fill="#e9e4f5" stroke="#8a7cf0" stroke-width="3"/><text x="32" y="38" text-anchor="middle" font-family="Rubik,sans-serif" font-weight="800" font-size="28" fill="#3b3450">?</text></svg>`,
 err:`<svg viewBox="0 0 64 56"><circle cx="32" cy="28" r="24" fill="#ffe0da" stroke="#e0574a" stroke-width="3"/><path d="M23 19l18 18M41 19L23 37" stroke="#e0574a" stroke-width="5" stroke-linecap="round"/></svg>`,
 down:`<svg viewBox="0 0 64 56"><circle cx="32" cy="28" r="24" fill="#dff3e8" stroke="#5fae84" stroke-width="3"/><path d="M32 14v22M23 28l9 9 9-9M20 42h24" stroke="#3b7a5a" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 /* іконки програм Майстерні */
 mouse:`<svg viewBox="0 0 64 56"><rect x="18" y="4" width="28" height="48" rx="14" fill="#fff" stroke="#e07a6a" stroke-width="3"/><path d="M32 4v18M18 22h28" stroke="#e07a6a" stroke-width="3"/><path d="M19 21V18A13 13 0 0 1 31 5v16z" fill="#f2b3c6"/></svg>`,
 firstpc:`<svg viewBox="0 0 64 56"><rect x="5" y="5" width="54" height="36" rx="5" fill="#3b3450"/><rect x="9" y="9" width="46" height="28" rx="2" fill="#bfe3cf"/><circle cx="32" cy="24" r="9" fill="#f6dc8a"/><circle cx="29" cy="22" r="1.6" fill="#3b3450"/><circle cx="35" cy="22" r="1.6" fill="#3b3450"/><path d="M28 27q4 3 8 0" stroke="#3b3450" stroke-width="1.8" fill="none" stroke-linecap="round"/><rect x="20" y="46" width="24" height="5" rx="2.5" fill="#8a93b8"/></svg>`,
 keys:`<svg viewBox="0 0 64 56"><rect x="4" y="14" width="56" height="34" rx="6" fill="#eceaf4" stroke="#7a84a8" stroke-width="3"/><g fill="#fff" stroke="#b9b3cc" stroke-width="1.5"><rect x="10" y="20" width="8" height="7" rx="2"/><rect x="21" y="20" width="8" height="7" rx="2"/><rect x="32" y="20" width="8" height="7" rx="2" fill="#f3cf6b"/><rect x="43" y="20" width="10" height="7" rx="2"/><rect x="10" y="30" width="12" height="7" rx="2"/><rect x="25" y="30" width="8" height="7" rx="2"/><rect x="36" y="30" width="17" height="7" rx="2"/><rect x="18" y="40" width="28" height="5" rx="2"/></g></svg>`,
 puzzle:`<svg viewBox="0 0 64 56"><path d="M10 14h12a6 6 0 1 1 10 0h12v12a6 6 0 1 1 0 10v12H32a6 6 0 1 0-10 0H10z" fill="#8fcfac" stroke="#3b7a5a" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
 sort:`<svg viewBox="0 0 64 56"><path d="M8 30h48l-5 20H13z" fill="#bddcf3" stroke="#4f8fd6" stroke-width="3" stroke-linejoin="round"/><circle cx="20" cy="22" r="7" fill="#e07a6a"/><circle cx="34" cy="16" r="7" fill="#f3cf6b"/><circle cx="46" cy="23" r="7" fill="#6fb38f"/></svg>`,
 robot:`<svg viewBox="0 0 64 56"><rect x="14" y="14" width="36" height="28" rx="8" fill="#bddcf3" stroke="#4f7fbf" stroke-width="3"/><circle cx="25" cy="27" r="4" fill="#3b3450"/><circle cx="39" cy="27" r="4" fill="#3b3450"/><path d="M32 14V7" stroke="#4f7fbf" stroke-width="3"/><circle cx="32" cy="5" r="3" fill="#e07a6a"/><rect x="20" y="44" width="8" height="8" rx="2" fill="#4f7fbf"/><rect x="36" y="44" width="8" height="8" rx="2" fill="#4f7fbf"/></svg>`,
 car:`<svg viewBox="0 0 64 56"><rect x="6" y="6" width="52" height="44" rx="6" fill="#3a3a52"/><path d="M32 8v40" stroke="#f6dc8a" stroke-width="3" stroke-dasharray="6 6"/><rect x="22" y="18" width="20" height="28" rx="5" fill="#e0574a"/><rect x="25" y="24" width="14" height="8" rx="2" fill="#bddcf3"/></svg>`,
 tangram:`<svg viewBox="0 0 64 56"><path d="M10 6h44L32 28z" fill="#8a7cf0"/><path d="M10 6v44l22-22z" fill="#e07a6a"/><path d="M54 6v22L43 17z" fill="#f3cf6b"/><path d="M32 28l11-11 11 11-11 11z" fill="#6fb38f"/><path d="M10 50h44L32 28z" fill="#6fa6d6"/></svg>`,
 circle:`<svg viewBox="0 0 64 56"><circle cx="30" cy="30" r="20" fill="none" stroke="#e07a6a" stroke-width="5" stroke-dasharray="110 20" stroke-linecap="round"/><path d="M44 8l10 10-14 14-11 2 2-11z" fill="#d5c7f1" stroke="#6c5fd0" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
 blocks:`<svg viewBox="0 0 64 56"><g stroke="#fff" stroke-width="2"><rect x="8" y="8" width="16" height="16" fill="#6fb38f"/><rect x="24" y="8" width="16" height="16" fill="#8a6a44"/><rect x="40" y="8" width="16" height="16" fill="#6fb38f"/><rect x="8" y="24" width="16" height="16" fill="#8a6a44"/><rect x="24" y="24" width="16" height="16" fill="#9aa3ad"/><rect x="24" y="40" width="16" height="12" fill="#6fa6d6"/><rect x="40" y="24" width="16" height="16" fill="#f3cf6b"/></g></svg>`,
 mines:`<svg viewBox="0 0 64 56"><rect x="6" y="4" width="52" height="48" rx="6" fill="#bddcf3"/><g fill="#eef5fd"><rect x="10" y="8" width="13" height="12" rx="2"/><rect x="25.5" y="8" width="13" height="12" rx="2"/><rect x="10" y="22" width="13" height="12" rx="2"/></g><text x="32" y="32" text-anchor="middle" font-family="Rubik,sans-serif" font-weight="800" font-size="11" fill="#4f7fbf">1</text><circle cx="45" cy="40" r="8" fill="#3b3450"/><path d="M45 28v24M33 40h24M37 32l16 16M53 32L37 48" stroke="#3b3450" stroke-width="2.5"/><path d="M16 50V38l8 3-8 3" fill="#e0574a" stroke="#3b3450" stroke-width="2"/></svg>`,
 words:`<svg viewBox="0 0 64 56"><rect x="8" y="4" width="48" height="48" rx="4" fill="#c0c0c0" stroke="#808080" stroke-width="2.5"/><g font-family="Rubik,sans-serif" font-weight="800" font-size="13" fill="#000080" text-anchor="middle"><text x="20" y="22">С</text><text x="32" y="22">Л</text><text x="44" y="22">О</text><text x="20" y="40">В</text><text x="32" y="40">О</text><text x="44" y="40">!</text></g></svg>`,
 photopz:`<svg viewBox="0 0 64 56"><rect x="6" y="6" width="52" height="44" rx="5" fill="#fff" stroke="#e07a6a" stroke-width="3"/><path d="M10 46l14-14 9 9 8-8 13 13z" fill="#8fcfac"/><circle cx="22" cy="20" r="5" fill="#f3cf6b"/><path d="M32 6v18a4 4 0 1 1 0 8v18M6 28h18" stroke="#e07a6a" stroke-width="2.5" fill="none"/></svg>`,
 pixel:`<svg viewBox="0 0 64 56"><rect x="8" y="4" width="48" height="48" rx="6" fill="#fff" stroke="#8a7cf0" stroke-width="3"/><g><rect x="16" y="12" width="8" height="8" fill="#e07a6a"/><rect x="40" y="12" width="8" height="8" fill="#e07a6a"/><rect x="16" y="20" width="32" height="8" fill="#e07a6a"/><rect x="24" y="28" width="16" height="8" fill="#e07a6a"/><rect x="28" y="36" width="8" height="8" fill="#e07a6a"/></g></svg>`,
 flow:`<svg viewBox="0 0 64 56"><rect x="20" y="3" width="24" height="10" rx="5" fill="#8fcfac" stroke="#3b7a5a" stroke-width="2"/><path d="M32 13v6" stroke="#3b3450" stroke-width="2.5"/><path d="M32 19l12 9-12 9-12-9z" fill="#f6dc8a" stroke="#d4a540" stroke-width="2"/><path d="M32 37v6" stroke="#3b3450" stroke-width="2.5"/><rect x="18" y="43" width="28" height="10" rx="2" fill="#bddcf3" stroke="#4f7fbf" stroke-width="2"/></svg>`,
 folderBadge:(pic)=>`<svg viewBox="0 0 100 86"><path d="M6 16a6 6 0 0 1 6-6h24l8 8h44a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill="#e8c25a"/><path d="M6 30h88v40a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill="#f6dc8a"/><g transform="translate(50 34) scale(.72)">${pic.replace(/<svg[^>]*>/,'').replace('</svg>','')}</g></svg>`,
 logo:`<svg viewBox="0 0 64 64"><defs><linearGradient id="sosLg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8a"/><stop offset="1" stop-color="#e8b04a"/></linearGradient></defs><rect x="4" y="4" width="56" height="56" rx="16" fill="#2c3563"/><path d="M12 46c6-8 14-11 20-11s14 3 20 11v4a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="url(#sosLg)"/><rect x="18" y="13" width="28" height="19" rx="3" fill="#a9cfee"/><rect x="18" y="13" width="28" height="5" rx="2" fill="#7f86ee"/><path d="M28 32h8l1 5h-10z" fill="#8a93b8"/><circle cx="20" cy="46" r="2" fill="#fff" opacity=".7"/><circle cx="42" cy="44" r="1.6" fill="#fff" opacity=".7"/></svg>`,
 start:`<svg viewBox="0 0 24 24"><rect x="2" y="2" width="9" height="9" rx="2" fill="#a9cfee"/><rect x="13" y="2" width="9" height="9" rx="2" fill="#a9cfee"/><rect x="2" y="13" width="9" height="9" rx="2" fill="#a9cfee"/><rect x="13" y="13" width="9" height="9" rx="2" fill="#f6dc8a"/></svg>`,
};
I.fifi=(open)=>{const F='#b3aca3',D='#5f574f',T='#a39c93';return `<svg viewBox="0 0 100 110"><path d="M73 98q22-2 18-28" stroke="${T}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M80 96l6-5M86 86l6-2M89 76l6 1" stroke="${D}" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="50" cy="82" rx="27" ry="23" fill="${F}"/><path d="M25 76q7 2 10 9M23 88q6 1 9 7M75 76q-7 2-10 9M77 88q-6 1-9 7" stroke="${D}" stroke-width="3.4" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="88" rx="14" ry="13" fill="#f6f1ea"/><path d="M26 36 24 9 45 22zM74 36l2-27-21 13z" fill="${F}"/><path d="M30 29l-1-12 9 7zM70 29l1-12-9 7z" fill="#f2a7a5"/><circle cx="50" cy="46" r="28" fill="${F}"/><path d="M40 30l4-10 6 8 6-8 4 10" stroke="${D}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 28v6" stroke="${D}" stroke-width="3" stroke-linecap="round"/><path d="M23 42q5 1 8 4M22 50q5 0 8 2M77 42q-5 1-8 4M78 50q-5 0-8 2" stroke="${D}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="58" rx="12" ry="8.5" fill="#f6f1ea"/><ellipse cx="39" cy="46" rx="4.8" ry="6.5" fill="#2f5d3a"/><ellipse cx="61" cy="46" rx="4.8" ry="6.5" fill="#2f5d3a"/><ellipse cx="39" cy="46.5" rx="2.2" ry="5" fill="#3b3450"/><ellipse cx="61" cy="46.5" rx="2.2" ry="5" fill="#3b3450"/><circle cx="40.5" cy="43.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="43.5" r="1.6" fill="#fff"/><ellipse cx="30" cy="57" rx="5" ry="3" fill="#f2a7a5" opacity=".8"/><ellipse cx="70" cy="57" rx="5" ry="3" fill="#f2a7a5" opacity=".8"/><path d="M46.5 53h7l-3.5 3.5z" fill="#e98593"/>${open?'<ellipse cx="50" cy="62" rx="5.5" ry="6.5" fill="#3b3450"/><ellipse cx="50" cy="65" rx="3.5" ry="2.5" fill="#e98593"/>':'<path d="M44 59q3 4 6 0q3 4 6 0" stroke="#3b3450" stroke-width="2.6" fill="none" stroke-linecap="round"/>'}<ellipse cx="38" cy="103" rx="8" ry="5" fill="#f6f1ea"/><ellipse cx="62" cy="103" rx="8" ry="5" fill="#f6f1ea"/></svg>`};
I.games=I.folderBadge(`<svg viewBox="0 0 64 56"><rect x="4" y="12" width="56" height="32" rx="16" fill="#3b3450"/><path d="M18 22v12M12 28h12" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="42" cy="24" r="3.5" fill="#f3cf6b"/><circle cx="49" cy="31" r="3.5" fill="#e07a6a"/></svg>`);
I.trainers=I.folderBadge(I.mouse);
I.tools=I.folderBadge(I.paint);
/* маленькі лінійні іконки */
const L={
 back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',fwd:'<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
 up:'<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',reload:'<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/></svg>',
 home:'<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/></svg>',
 newf:'<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 11v6M9 14h6"/></svg>',
 cut:'<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8 16L18 4M16 16L6 4"/></svg>',
 copy:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/></svg>',
 paste:'<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6"/></svg>',
 ren:'<svg viewBox="0 0 24 24"><path d="M4 20l1-5L16 4l4 4L9 19z"/></svg>',
 del:'<svg viewBox="0 0 24 24"><path d="M5 7h14l-1 14H6zM3 7h18M9 7V4h6v3"/></svg>',
 restore:'<svg viewBox="0 0 24 24"><path d="M9 5L4 10l5 5"/><path d="M4 10h10a6 6 0 0 1 0 12h-3"/></svg>',
 search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
 power:'<svg viewBox="0 0 24 24"><path d="M12 3v9M6.5 7a8 8 0 1 0 11 0"/></svg>',
 snd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
 mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
 brush:'<svg viewBox="0 0 24 24"><path d="M20 3L9 14"/><path d="M9 14c-3 0-5 2-5 5 0 1-1 2-2 2 3 1 8 0 8-4z"/></svg>',
 pencil:'<svg viewBox="0 0 24 24"><path d="M4 20l1-5L16 4l4 4L9 19z"/></svg>',
 eraser:'<svg viewBox="0 0 24 24"><path d="M8 20h12M5 15l9-9 5 5-8 8H8z"/></svg>',
 fill:'<svg viewBox="0 0 24 24"><path d="M5 11l7-7 7 7-7 7z"/><path d="M19 15s2 2.5 2 4a2 2 0 0 1-4 0c0-1.5 2-4 2-4z"/></svg>',
 line:'<svg viewBox="0 0 24 24"><path d="M5 19L19 5"/></svg>',rect:'<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="1"/></svg>',
 oval:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="7"/></svg>',
 undo:'<svg viewBox="0 0 24 24"><path d="M9 5L4 10l5 5"/><path d="M4 10h10a6 6 0 0 1 0 12h-3"/></svg>',
 redo:'<svg viewBox="0 0 24 24"><path d="M15 5l5 5-5 5"/><path d="M20 10H10a6 6 0 0 0 0 12h3"/></svg>',
 trash:'<svg viewBox="0 0 24 24"><path d="M5 7h14l-1 14H6zM3 7h18M9 7V4h6v3"/></svg>',
 wall:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6"/></svg>',
 disk:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="3"/><path d="M7 12h5"/></svg>',
 globe:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/></svg>',
 about:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
 full:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
};
const WB={min:'<svg viewBox="0 0 14 14"><path d="M2 7h10"/></svg>',max:'<svg viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" rx="1"/></svg>',
 unmax:'<svg viewBox="0 0 14 14"><rect x="2" y="4" width="8" height="8" rx="1"/><path d="M4 4V2h8v8h-2"/></svg>',x:'<svg viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12"/></svg>'};

const WALLS=[
 {id:'sky',n:'Небо',css:'radial-gradient(circle at 78% 22%,rgba(255,255,255,.35) 0,transparent 30%),linear-gradient(135deg,#58a6f3 0%,#7d88ee 55%,#b48cf0 100%)'},
 {id:'sunset',n:'Захід',css:'radial-gradient(circle at 80% 20%,rgba(255,210,63,.35) 0,transparent 25%),linear-gradient(135deg,#3b2f7e,#6b4fd8 60%,#f0a56e)'},
 {id:'meadow',n:'Луг',css:'radial-gradient(circle at 80% 20%,rgba(255,255,255,.5) 0,transparent 25%),linear-gradient(135deg,#a9cfee,#6fb38f 70%,#e07a6a)'},
 {id:'mint',n:"М'ята",css:'radial-gradient(circle at 20% 80%,rgba(255,255,255,.35) 0,transparent 30%),linear-gradient(160deg,#9fdcc0,#5aa8a0 70%,#3f7f9a)'},
 {id:'peach',n:'Персик',css:'radial-gradient(circle at 75% 25%,rgba(255,255,255,.45) 0,transparent 28%),linear-gradient(135deg,#f9d3b4,#eba497 60%,#c98bc4)'},
 {id:'night',n:'Ніч',css:'radial-gradient(circle at 20% 30%,rgba(255,255,255,.9) 0 1px,transparent 2px),radial-gradient(circle at 70% 20%,rgba(255,255,255,.8) 0 1px,transparent 2px),radial-gradient(circle at 45% 60%,rgba(255,255,255,.7) 0 1px,transparent 2px),radial-gradient(circle at 85% 70%,rgba(255,255,255,.8) 0 1px,transparent 2px),radial-gradient(circle at 80% 15%,rgba(246,220,138,.5) 0,transparent 12%),linear-gradient(160deg,#1f2547,#3b3a7a 70%,#5b4a8a)'},
];

/* ---------------- розкладки клавіатури ---------------- */
const CODES=('Backquote Digit1 Digit2 Digit3 Digit4 Digit5 Digit6 Digit7 Digit8 Digit9 Digit0 Minus Equal KeyQ KeyW KeyE KeyR KeyT KeyY KeyU KeyI KeyO KeyP BracketLeft BracketRight Backslash KeyA KeyS KeyD KeyF KeyG KeyH KeyJ KeyK KeyL Semicolon Quote KeyZ KeyX KeyC KeyV KeyB KeyN KeyM Comma Period Slash').split(' ');
const LAY={
 en:["`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./",'~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?'],
 ua:["'1234567890-=йцукенгшщзхїґфівапролджєячсмитьбю.",'₴!"№;%:?*()_+ЙЦУКЕНГШЩЗХЇҐФІВАПРОЛДЖЄЯЧСМИТЬБЮ,'],
};
function layChar(code,shift,lang){const i=CODES.indexOf(code);if(i<0)return null;return [...LAY[lang][shift?1:0]][i]||null}

/* ---------------- утиліти ---------------- */
const $=(s,r)=>(r||document).querySelector(s);
const h=(html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MONTHS=['січень','лютий','березень','квітень','травень','червень','липень','серпень','вересень','жовтень','листопад','грудень'];
const MONTHS_G=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
const DAYS=['неділя','понеділок','вівторок','середа','четвер','пʼятниця','субота'];
const pad=n=>String(n).padStart(2,'0');
const fmtDate=t=>{const d=new Date(t);return pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+d.getFullYear()+' '+pad(d.getHours())+':'+pad(d.getMinutes())};
const fmtSize=b=>b<1024?b+' Б':b<1048576?(b/1024).toFixed(1).replace('.',',')+' КБ':(b/1048576).toFixed(1).replace('.',',')+' МБ';
const plural=(n,a,b,c)=>{const m=n%10,k=n%100;return n+' '+(m===1&&k!==11?a:m>=2&&m<=4&&(k<10||k>=20)?b:c)};
const BAD=/[\\/:*?"<>|]/;
const CAP=5*1024*1024;

/* =====================================================================
   BOOT
   ===================================================================== */
function boot(root,opt){
opt=Object.assign({key:'sandos',base:'../',catalog:true,bootAnim:true,title:'Sand OS'},opt||{});
if(!document.getElementById('sos-css')){const s=document.createElement('style');s.id='sos-css';s.textContent=CSS;document.head.appendChild(s)}
const OS={I,L,esc,h,apps:{},wins:[],opt,ver:VER};
let via='mouse';const act=e=>{e.via=e.via||via;emit('act',e)};OS.act=act;
const listeners={};OS.on=(e,f)=>{(listeners[e]=listeners[e]||[]).push(f)};const emit=(e,a)=>(listeners[e]||[]).forEach(f=>{try{f(a)}catch(er){console.error(er)}});

/* ---------- стан ---------- */
let S;
function defaults(){
  const now=Date.now();
  const n={
   c:{id:'c',name:'Локальний диск (C:)',type:'dir',parent:null,sys:1},
   desk:{id:'desk',name:'Робочий стіл',type:'dir',parent:'c',sys:1},
   docs:{id:'docs',name:'Документи',type:'dir',parent:'c',sys:1},
   pics:{id:'pics',name:'Малюнки',type:'dir',parent:'c',sys:1},
   down:{id:'down',name:'Завантаження',type:'dir',parent:'c',sys:1},
   music:{id:'music',name:'Музика',type:'dir',parent:'c',sys:1},
   trash:{id:'trash',name:'Кошик',type:'dir',parent:null,sys:1},
  };
  let k=0;const add=(parent,name,type,ext,data,extra)=>{const id='n'+(++k);n[id]=Object.assign({id,name,type,ext:ext||'',data:data||'',parent,ct:now,mt:now},extra||{});return id};
  const lnk=(parent,app,name)=>add(parent,name||OS.apps[app]&&OS.apps[app].name||app,'file','lnk',app);
  const deskL=(opt.desktop||['pc','browser','notepad','paint','calc']).concat((opt.deskAdd||[]).filter(a=>OS.apps[a]));
  const pos={};deskL.forEach((a,i)=>{const id=lnk('desk',a);if(a==='pc')pos[id]=[0,0];if(a===(opt.deskAdd||[])[0])pos[id]=[0,2]});pos['@bin']=[0,1];
  if(opt.catalog){
    const FD={game:['Ігри','games'],trainer:['Тренажери','trainers'],tool:['Інструменти','tools']};
    (opt.deskFolders||['game','trainer','tool']).forEach(c=>{const l=Object.values(OS.apps).filter(a=>a.cat===c);if(!l.length)return;const f=add('desk',FD[c][0],'dir');n[f].icon=FD[c][1];l.forEach(a=>lnk(f,a.id))});
  }
  if(opt.seed){opt.seed(add,lnk,n);}else{
  add('desk','Привіт','file','txt','Привіт! Це твій власний комп\'ютер-пісочниця.\n\nТут можна все: створювати папки й файли, перейменовувати, видаляти й повертати їх із кошика.\n\nСпробуй:\n1. Натисни правою кнопкою на робочому столі → «Створити» → «Папку».\n2. Перетягни цей файл у нову папку.\n3. Видали папку, а потім відкрий «Кошик» і поверни її.\n\nНічого не зламається — сміливо пробуй!');
  add('docs','Мій розклад','file','txt','Понеділок: математика, читання, інформатика\nВівторок: українська мова, малювання\nСереда: природознавство, фізкультура\n');
  add('docs','Список покупок','file','txt','- молоко\n- хліб\n- яблука\n- олівці');}
  return {v:1,nodes:n,seq:k+1,pos,ens:Object.fromEntries((opt.deskAdd||[]).map(a=>[a,1])),wall:'sky',lang:'ua',snd:localStorage.getItem(opt.key+'-snd')!=='0',mt:now};
}
function load(){try{const s=JSON.parse(localStorage.getItem(opt.key)||'null');if(s&&s.v===1&&s.nodes&&s.nodes.c)return s}catch(e){}return null}
let saveT=0,quotaWarned=false;
function save(){clearTimeout(saveT);saveT=setTimeout(saveNow,250)}
function saveNow(){try{localStorage.setItem(opt.key+'-snd',S.snd?'1':'0');localStorage.setItem(opt.key,JSON.stringify(S));quotaWarned=false}catch(e){if(!quotaWarned){quotaWarned=true;msg('Диск C: заповнено','Місця на диску більше немає. Видали великі малюнки й очисти кошик.','err')}}}
OS.usage=()=>{try{return JSON.stringify(S).length*2}catch(e){return 0}};

/* ---------- файлова система ---------- */
const F={
 get:id=>S.nodes[id],
 kids:pid=>Object.values(S.nodes).filter(n=>n.parent===pid).sort((a,b)=>(a.type===b.type?0:a.type==='dir'?-1:1)||a.name.localeCompare(b.name,'uk',{numeric:true})),
 path(id){const p=[];let n=S.nodes[id];while(n){p.unshift(n);n=S.nodes[n.parent]}return p},
 full(n){return n.name+(n.ext&&n.ext!=='lnk'?'.'+n.ext:'')},
 exists(pid,name,ext,except){return Object.values(S.nodes).some(n=>n.parent===pid&&n.id!==except&&n.name.toLowerCase()===name.toLowerCase()&&(n.ext||'')===(ext||''))},
 uniq(pid,name,ext){if(!F.exists(pid,name,ext))return name;let i=2;const base=name.replace(/ \(\d+\)$/,'');while(F.exists(pid,base+' ('+i+')',ext))i++;return base+' ('+i+')'},
 isIn(id,anc){let n=S.nodes[id];while(n){if(n.id===anc)return true;n=S.nodes[n.parent]}return false},
 mk(pid,name,type,ext,data,extra){const id='n'+(S.seq++);const t=Date.now();S.nodes[id]=Object.assign({id,name:F.uniq(pid,name,ext),type,ext:ext||'',data:data||'',parent:pid,ct:t,mt:t},extra||{});changed();return S.nodes[id]},
 write(id,data){const n=S.nodes[id];if(!n)return;n.data=data;n.mt=Date.now();changed()},
 size(n){if(n.type==='dir')return F.kids(n.id).reduce((s,k)=>s+F.size(k),0);return n.ext==='png'?Math.round((n.data||'').length*.75):new Blob([n.data||'']).size},
 count(id){let c=0;F.kids(id).forEach(k=>{c++;if(k.type==='dir')c+=F.count(k.id)});return c},
 rename(id,name){const n=S.nodes[id];name=(name||'').trim();if(!n||name===n.name)return true;
   if(!name){msg('Перейменування','Назва не може бути порожньою.','warn');return false}
   if(BAD.test(name)){msg('Перейменування','Назва не може містити ці знаки:\n\\ / : * ? " < > |','warn');return false}
   if(name.length>60){msg('Перейменування','Назва задовга — не більше 60 знаків.','warn');return false}
   if(F.exists(n.parent,name,n.ext,id)){msg('Перейменування','У цій папці вже є '+(n.type==='dir'?'папка':'файл')+' з назвою «'+name+'».','warn');return false}
   n.name=name;n.mt=Date.now();changed();snd('click');act({t:'rename',type:n.type});return true},
 move(id,pid){const n=S.nodes[id];if(!n||n.parent===pid)return false;if(n.sys){msg('Переміщення','«'+n.name+'» — системна папка, її не можна переміщати.','warn');return false}
   if(F.isIn(pid,id)){msg('Переміщення','Не можна перемістити папку саму в себе.','warn');return false}
   n.name=F.uniq(pid,n.name,n.ext);n.parent=pid;delete S.pos[id];changed();act({t:'move',to:pid,type:n.type});return true},
 copy(id,pid){const n=S.nodes[id];if(!n)return null;if(F.isIn(pid,id)&&n.type==='dir'){msg('Копіювання','Не можна скопіювати папку саму в себе.','warn');return null}
   const nid='n'+(S.seq++);const name=n.parent===pid?F.uniq(pid,n.name+' — копія',n.ext):F.uniq(pid,n.name,n.ext);
   S.nodes[nid]=Object.assign({},n,{id:nid,parent:pid,name,ct:Date.now(),sys:0});delete S.nodes[nid].from;
   if(n.type==='dir')F.kids(id).forEach(k=>F.copy(k.id,nid));changed();return S.nodes[nid]},
 del(id){const n=S.nodes[id];if(!n)return false;if(n.sys){msg('Видалення','«'+n.name+'» — системна папка, її не можна видалити.','warn');return false}
   n.from=n.parent;n.parent='trash';n.at=Date.now();delete S.pos[id];changed();act({t:'del',type:n.type});return true},
 restore(id){const n=S.nodes[id];if(!n||n.parent!=='trash')return;const to=S.nodes[n.from]&&!F.isIn(n.from,'trash')?n.from:'desk';n.name=F.uniq(to,n.name,n.ext);n.parent=to;delete n.from;delete n.at;changed();act({t:'restore'})},
 purge(id){F.kids(id).forEach(k=>F.purge(k.id));delete S.nodes[id];delete S.pos[id];changed()},
 icon(n){if(n.icon&&I[n.icon])return I[n.icon];if(n.type==='dir')return I.folder;if(n.ext==='lnk'){const a=OS.apps[n.data];return a?a.icon:I.unknown}
   if(n.ext==='txt')return I.txt;if(n.ext==='png')return I.img;return I.unknown},
 typeName(n){if(n.type==='dir')return 'Папка';return {txt:'Текстовий документ',png:'Малюнок PNG',lnk:'Ярлик програми'}[n.ext]||'Файл '+(n.ext||'').toUpperCase()},
 find(q){q=q.toLowerCase();return Object.values(S.nodes).filter(n=>n.parent&&n.parent!=='trash'&&!F.isIn(n.id,'trash')&&!n.sys&&n.ext!=='lnk'&&F.full(n).toLowerCase().includes(q)).slice(0,8)},
};
OS.fs=F;
let chT=0;function changed(){S.mt=Date.now();save();clearTimeout(chT);chT=setTimeout(()=>{emit('fs');if(String(S.wall).startsWith('img:'))wall.style.background=wallCss()},0)}

/* ---------- звук ---------- */
let AC=null;
function snd(type){if(!S||!S.snd)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
  const t=AC.currentTime,tone=(f,d,w,v,f2,dl)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=w||'sine';o.frequency.setValueAtTime(f,t+(dl||0));if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+(dl||0)+d);g.gain.setValueAtTime(0,t+(dl||0));g.gain.linearRampToValueAtTime(v||.06,t+(dl||0)+.01);g.gain.exponentialRampToValueAtTime(.0001,t+(dl||0)+d);o.connect(g);g.connect(AC.destination);o.start(t+(dl||0));o.stop(t+(dl||0)+d+.02)};
  ({click:()=>tone(900,.05,'sine',.03),open:()=>{tone(520,.08,'sine',.05);tone(780,.1,'sine',.05,0,.06)},close:()=>tone(600,.09,'sine',.04,380),
   trash:()=>{tone(300,.12,'triangle',.07,140)},err:()=>{tone(320,.14,'square',.035);tone(260,.18,'square',.035,0,.12)},
   note:()=>{tone(880,.1,'sine',.05);tone(1320,.14,'sine',.05,0,.1)},boot:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.35,'sine',.05,0,i*.13))},
   empty:()=>{tone(500,.25,'sawtooth',.03,90)},shot:()=>tone(1200,.06,'square',.03)})[type]()}catch(e){}}
OS.snd=snd;

/* ---------- DOM каркас ---------- */
root.innerHTML='';root.classList.add('sos');
root.innerHTML=`<div class="sos-wall"></div><div class="sos-desk"><div class="sos-icons" tabindex="-1"></div></div><div class="sos-toasts"></div>
<div class="sos-bar"><button class="sos-startb" title="Пуск" aria-label="Пуск">${I.start}</button><div class="sos-tasks"></div>
<div class="sos-tray"><button class="sos-lang" title="Мова вводу (Alt+Shift)"></button><button class="sos-sndb" title="Звук"></button><button class="sos-clock" title="Календар"><b></b><small></small></button><button class="sos-showd" title="Показати робочий стіл" aria-label="Показати робочий стіл"></button></div></div>`;
const wall=$('.sos-wall',root),desk=$('.sos-desk',root),iconsEl=$('.sos-icons',root),tasks=$('.sos-tasks',root),toasts=$('.sos-toasts',root);
const langB=$('.sos-lang',root),sndB=$('.sos-sndb',root),clockB=$('.sos-clock',root);
OS.root=root;OS.desk=desk;

/* ---------- меню ---------- */
let menuEl=null;
function closeMenu(){if(menuEl){menuEl.remove();menuEl=null}}
function menu(x,y,items,parentMenu){
  if(!parentMenu)closeMenu();
  const m=h('<div class="sos-menu" role="menu"></div>');
  items.forEach(it=>{if(!it)return;if(it==='-'){m.appendChild(h('<hr>'));return}
    const b=h(`<button role="menuitem" class="${it.sub?'sub':''}"${it.dis?' disabled':''}><i>${it.icon||''}</i><span>${esc(it.t)}</span>${it.k?'<kbd>'+it.k+'</kbd>':''}</button>`);
    if(it.sub){const open=()=>{m.querySelectorAll('.sos-menu').forEach(s=>s.remove());const r=b.getBoundingClientRect();const sm=menu(r.right-4,r.top-5,it.sub,m);m.appendChild(sm)};b.addEventListener('pointerenter',open);b.addEventListener('click',e=>{e.stopPropagation();open()})}
    else b.addEventListener('click',e=>{e.stopPropagation();closeMenu();it.f&&it.f()});
    m.appendChild(b)});
  (parentMenu?parentMenu:root).appendChild(m);
  if(parentMenu){m.style.position='fixed'}
  const r=m.getBoundingClientRect(),W=innerWidth,H=innerHeight;
  if(x+r.width>W-4)x=parentMenu?x-r.width-parentMenu.getBoundingClientRect().width+8:W-r.width-4;if(y+r.height>H-4)y=Math.max(4,H-r.height-4);
  m.style.left=Math.max(4,x)+'px';m.style.top=y+'px';
  if(!parentMenu)menuEl=m;
  return m;
}
OS.menu=menu;OS.closeMenu=closeMenu;
document.addEventListener('pointerdown',e=>{if(menuEl&&!e.target.closest('.sos-menu'))closeMenu();
  if(startEl&&!e.target.closest('.sos-start,.sos-startb'))closeStart();
  if(popEl&&!e.target.closest('.sos-pop,.sos-clock'))closePop()},true);

/* ---------- діалоги ---------- */
function dialog({title='Повідомлення',icon='info',text='',input=null,buttons=[{t:'OK',v:true,p:1}],sel=null}){
  return new Promise(res=>{
    const m=h(`<div class="sos-modal"><div class="sos-dlg" role="dialog" aria-modal="true"><div class="swt"><i>${I[icon]||icon}</i><b>${esc(title)}</b><button class="x" aria-label="Закрити">${WB.x}</button></div>
      <div class="db"><i>${I[icon]||''}</i><div style="flex:1;white-space:pre-line">${esc(text)}${input!==null?'<input type="text" spellcheck="false">':''}</div></div>
      <div class="df"></div></div></div>`);
    const df=$('.df',m),inp=$('input',m);
    const done=v=>{m.remove();document.removeEventListener('keydown',kd,true);res(v)};
    buttons.forEach(b=>{const el=h(`<button class="sos-btn${b.p?' p':''}${b.d?' d':''}">${esc(b.t)}</button>`);el.onclick=()=>done(inp&&b.v===true?inp.value:b.v);df.appendChild(el)});
    $('.x',m).onclick=()=>done(buttons.some(b=>b.v===null)?null:buttons[buttons.length-1].v===true?null:buttons[buttons.length-1].v);
    const kd=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();done(null)}else if(e.key==='Enter'){e.preventDefault();e.stopPropagation();const p=buttons.find(b=>b.p)||buttons[0];done(inp&&p.v===true?inp.value:p.v)}};
    document.addEventListener('keydown',kd,true);
    root.appendChild(m);
    if(inp){inp.value=input;inp.focus();if(sel)inp.setSelectionRange(sel[0],sel[1]);else inp.select();bindLang(inp)}else setTimeout(()=>{const p=df.querySelector('.p')||df.firstChild;p&&p.focus()},30);
    snd(icon==='err'||icon==='warn'?'err':'note');
  });
}
function msg(title,text,icon){return dialog({title,text,icon:icon||'info'})}
OS.dialog=dialog;OS.msg=msg;
OS.confirm=(title,text,yes='Так',no='Ні',icon='ask')=>dialog({title,text,icon,buttons:[{t:yes,v:true,p:1},{t:no,v:false}]});
OS.prompt=(title,text,val)=>dialog({title,text,icon:'ask',input:val||'',buttons:[{t:'OK',v:true,p:1},{t:'Скасувати',v:null}]});

/* ---------- сповіщення ---------- */
function notify(title,text,icon,action){
  const t=h(`<div class="sos-toast"><i>${I[icon]||icon||I.info}</i><div><b>${esc(title)}</b>${text?'<p>'+esc(text)+'</p>':''}${action?'<button class="act">'+esc(action.t)+'</button>':''}</div></div>`);
  if(action)$('.act',t).onclick=()=>{t.remove();action.f()};
  toasts.appendChild(t);snd('note');setTimeout(()=>{t.style.transition='opacity .3s';t.style.opacity='0';setTimeout(()=>t.remove(),300)},5000);
}
OS.notify=notify;

/* ---------- мова вводу ---------- */
function setLang(l,user){if(user)act({t:'lang',lang:l});S.lang=l;langB.textContent=l==='ua'?'UA':'EN';langB.title=(l==='ua'?'Українська':'English')+' — змінити: Alt+Shift';save()}
OS.toggleLang=()=>{setLang(S.lang==='ua'?'en':'ua',1);snd('click')};
langB.onclick=()=>OS.toggleLang();
function bindLang(el){
  if(el._sosLang)return;el._sosLang=1;
  el.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return;
    const ch=layChar(e.code,e.shiftKey!==(e.getModifierState&&e.getModifierState('CapsLock')&&/^Key/.test(e.code)),S.lang);
    if(!ch||ch===e.key)return;e.preventDefault();
    if(el.isContentEditable){document.execCommand('insertText',false,ch)}
    else{const s=el.selectionStart,en=el.selectionEnd;el.setRangeText(ch,s,en,'end');el.dispatchEvent(new Event('input',{bubbles:true}))}
  });
}
OS.bindLang=bindLang;
root.addEventListener('focusin',e=>{const t=e.target;if(t.matches('input[type=text],input[type=search],input:not([type]),textarea,[contenteditable=true]'))bindLang(t)});

/* ---------- годинник і календар ---------- */
function tick(){const d=new Date();$('b',clockB).textContent=pad(d.getHours())+':'+pad(d.getMinutes());$('small',clockB).textContent=pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+d.getFullYear()}
tick();setInterval(tick,5000);
function calendarEl(){
  const el=h('<div class="sos-cal"><div class="hd"><b></b><button aria-label="Попередній місяць">‹</button><button aria-label="Наступний місяць">›</button></div><div class="g"></div></div>');
  let cur=new Date();cur.setDate(1);
  const draw=()=>{const y=cur.getFullYear(),m=cur.getMonth(),today=new Date();$('b',el).textContent=MONTHS[m]+' '+y;
    const g=$('.g',el);g.innerHTML=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(d=>'<span>'+d+'</span>').join('');
    const first=(new Date(y,m,1).getDay()+6)%7,start=new Date(y,m,1-first);
    for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const b=document.createElement('button');b.textContent=d.getDate();
      if(d.getMonth()!==m)b.className='o';else if(d.getDay()===0||d.getDay()===6)b.className='we';
      if(d.toDateString()===today.toDateString())b.className='t';b.title=d.getDate()+' '+MONTHS_G[d.getMonth()]+', '+DAYS[d.getDay()];g.appendChild(b)}};
  const bs=el.querySelectorAll('.hd button');bs[0].onclick=()=>{cur.setMonth(cur.getMonth()-1);draw()};bs[1].onclick=()=>{cur.setMonth(cur.getMonth()+1);draw()};
  draw();el.today=()=>{cur=new Date();cur.setDate(1);draw()};return el;
}
OS.calendarEl=calendarEl;
let popEl=null;function closePop(){if(popEl){popEl.remove();popEl=null;clockB.classList.remove('on')}}
clockB.onclick=()=>{if(popEl){closePop();return}closeStart();const d=new Date();
  popEl=h(`<div class="sos-pop"><div class="sos-bigtime">${pad(d.getHours())}:${pad(d.getMinutes())}</div><div class="sos-bigdate">${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_G[d.getMonth()]} ${d.getFullYear()}</div></div>`);
  popEl.appendChild(calendarEl());root.appendChild(popEl);clockB.classList.add('on');snd('click')};

/* ---------- звук у треї ---------- */
function drawSnd(){sndB.innerHTML=S.snd?L.snd:L.mute;sndB.title=S.snd?'Звук увімкнено':'Звук вимкнено'}
sndB.onclick=()=>{S.snd=!S.snd;drawSnd();save();snd('click');emit('settings')};
OS.setSound=v=>{S.snd=!!v;drawSnd();save();emit('settings')};

/* ---------- шпалери ---------- */
function wallCss(id){id=id||S.wall;if(String(id).startsWith('img:')){const n=F.get(id.slice(4));if(n&&n.data&&!F.isIn(n.id,'trash'))return '#2a2838 url("'+n.data+'") center/cover no-repeat'}return (WALLS.find(x=>x.id===id)||WALLS[0]).css}
function setWall(id,user){S.wall=id;if(String(id).startsWith('img:')&&!F.get(id.slice(4)))S.wall='sky';else if(!String(id).startsWith('img:')&&!WALLS.find(x=>x.id===id))S.wall='sky';wall.style.background=wallCss();save();emit('settings');if(user){act({t:'wall'});snd('click')}}
OS.wallCss=wallCss;
OS.walls=WALLS;OS.setWall=setWall;

/* =====================================================================
   ВІКНА
   ===================================================================== */
let Z=10,active=null,cascade=0;
function deskRect(){return desk.getBoundingClientRect()}
const small=()=>innerWidth<700;
function win(o){
  o=Object.assign({w:720,h:480,title:'',icon:I.notepad,resizable:true,max:false},o);
  const dr=deskRect();
  const w=Math.min(o.w,dr.width-20),hh=Math.min(o.h,dr.height-20);
  cascade=(cascade+1)%7;
  const x=Math.max(4,Math.round((dr.width-w)/2-90+cascade*30)),y=Math.max(4,Math.round((dr.height-hh)/2-60+cascade*26));
  const el=h(`<div class="sw" role="dialog" style="left:${x}px;top:${y}px;width:${w}px;height:${hh}px"><div class="swt"><i></i><b></b>
   <button class="mn" aria-label="Згорнути" title="Згорнути">${WB.min}</button>${o.resizable?`<button class="mx" aria-label="Розгорнути" title="Розгорнути">${WB.max}</button>`:''}<button class="x" aria-label="Закрити" title="Закрити">${WB.x}</button></div>
   <div class="swb"></div><div class="sw-shield"></div>${o.resizable?'<div class="swr"></div>':''}</div>`);
  const W={el,body:$('.swb',el),app:o.app,id:Math.random().toString(36).slice(2),o};
  W.setTitle=t=>{W.title=t;$('.swt b',el).textContent=t;W.task&&($('span',W.task).textContent=t)};
  W.setIcon=ic=>{$('.swt i',el).innerHTML=ic;W.task&&($('i',W.task).innerHTML=ic)};
  W.focus=()=>focusWin(W);
  W.close=async(force)=>{if(!force&&W.beforeClose){const ok=await W.beforeClose();if(!ok)return}closeWin(W)};
  W.minimize=()=>{act({t:'min',app:o.app});el.classList.add('min');W.task.classList.add('min');if(active===W){active=null;const nxt=[...OS.wins].reverse().find(x=>x!==W&&!x.el.classList.contains('min'));nxt?focusWin(nxt):drawTasks()}};
  W.toggleMax=()=>{el.classList.toggle('max');act({t:'max',app:o.app,on:el.classList.contains('max')});const mx=$('.mx',el);if(mx)mx.innerHTML=el.classList.contains('max')?WB.unmax:WB.max;W.onResize&&W.onResize()};
  desk.appendChild(el);OS.wins.push(W);
  W.task=h(`<button class="sos-task"><i>${o.icon}</i><span></span></button>`);
  W.task.onclick=()=>{if(el.classList.contains('min')){el.classList.remove('min');W.task.classList.remove('min');focusWin(W)}else if(active===W)W.minimize();else focusWin(W)};
  W.task.oncontextmenu=e=>{e.preventDefault();menu(e.clientX,e.clientY-90,[{t:'Закрити вікно',icon:I.err,f:()=>W.close()}])};
  tasks.appendChild(W.task);
  W.setTitle(o.title);W.setIcon(o.icon);
  el.addEventListener('pointerdown',()=>{if(active!==W)focusWin(W)},true);
  $('.mn',el).onclick=e=>{e.stopPropagation();W.minimize()};$('.x',el).onclick=e=>{e.stopPropagation();W.close()};
  if(o.resizable){$('.mx',el).onclick=e=>{e.stopPropagation();W.toggleMax()};const born=Date.now();$('.swt',el).addEventListener('dblclick',e=>{if(Date.now()-born>600&&!e.target.closest('button'))W.toggleMax()})}
  /* перетягування */
  const bar=$('.swt',el);
  bar.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button'))return;
    const r=el.getBoundingClientRect(),d=deskRect();let ox=e.clientX-r.left,oy=e.clientY-r.top,moved=false;
    const mv=ev=>{if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<4)return;
      if(!moved){moved=true;root.classList.add('dragging');if(el.classList.contains('max')){const fw=parseFloat(el.style.width)||o.w;el.classList.remove('max');$('.mx',el)&&($('.mx',el).innerHTML=WB.max);ox=Math.min(ox,fw-80);}}
      let nx=ev.clientX-d.left-ox,ny=ev.clientY-d.top-oy;nx=Math.max(-el.offsetWidth+80,Math.min(d.width-80,nx));ny=Math.max(0,Math.min(d.height-40,ny));el.style.left=nx+'px';el.style.top=ny+'px'};
    const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);root.classList.remove('dragging');
      if(moved&&ev.clientY-d.top<6&&o.resizable&&!el.classList.contains('max'))W.toggleMax()};
    addEventListener('pointermove',mv);addEventListener('pointerup',up)});
  if(o.resizable){const rz=$('.swr',el);rz.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const sw=el.offsetWidth,sh=el.offsetHeight;root.classList.add('dragging');
    const mv=ev=>{el.style.width=Math.max(260,sw+ev.clientX-e.clientX)+'px';el.style.height=Math.max(160,sh+ev.clientY-e.clientY)+'px';W.onResize&&W.onResize()};
    const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);root.classList.remove('dragging')};addEventListener('pointermove',mv);addEventListener('pointerup',up)})}
  if(o.max||small())W.toggleMax();
  focusWin(W);snd('open');
  return W;
}
function focusWin(W){if(!W)return;W.el.style.zIndex=++Z;active=W;OS.wins.forEach(x=>x.el.classList.toggle('inactive',x!==W));drawTasks();W.onFocus&&W.onFocus()}
function closeWin(W){act({t:'close',app:W.app});W.onClose&&W.onClose();W.el.classList.add('closing');W.task.remove();OS.wins=OS.wins.filter(x=>x!==W);if(active===W){active=null;const nxt=[...OS.wins].reverse().find(x=>!x.el.classList.contains('min'));nxt&&focusWin(nxt)}
  setTimeout(()=>W.el.remove(),160);drawTasks();snd('close')}
function drawTasks(){OS.wins.forEach(x=>x.task.classList.toggle('on',x===active&&!x.el.classList.contains('min')))}
OS.win=win;OS.activeWin=()=>active;
$('.sos-showd',root).onclick=()=>{const vis=OS.wins.filter(w=>!w.el.classList.contains('min'));if(vis.length)vis.forEach(w=>w.minimize());else OS.wins.forEach(w=>{w.el.classList.remove('min');w.task.classList.remove('min')});active=null;drawTasks()};

/* ---------- програми ---------- */
function register(a){OS.apps[a.id]=Object.assign({cat:'sys'},a)}
OS.register=register;
function openApp(id,arg){
  const a=OS.apps[id];if(!a){msg('Помилка','Програму не знайдено. Можливо, ярлик зламався.','err');return}
  closeStart();act({t:'open',app:id,arg});
  if(a.single){const ex=OS.wins.find(w=>w.app===id);if(ex){ex.el.classList.remove('min');ex.task.classList.remove('min');focusWin(ex);ex.onArg&&arg!==undefined&&ex.onArg(arg);return ex}}
  if(a.url){const W=win({app:id,title:a.name,icon:a.icon,w:a.w||1100,h:a.h||700,max:a.max!==false});
    const fr=document.createElement('iframe');fr.src=a.url;fr.title=a.name;fr.allow='fullscreen; autoplay; clipboard-write';W.body.appendChild(fr);return W}
  return a.open(arg);
}
OS.open=openApp;
function openNode(n){
  if(!n)return;
  if(n.type==='dir'){if(n.id==='trash')openApp('bin');else openApp('explorer',n.id);return}
  if(n.ext==='lnk'){openApp(n.data);return}
  const h2=(opt.handlers||{})[n.ext];if(h2){h2(n);return}
  if(n.ext==='txt'){openApp('notepad',n.id);return}
  if(n.ext==='png'){openApp('photos',n.id);return}
  msg('Як відкрити цей файл?','Для файлів «.'+(n.ext||'?')+'» на цьому комп\'ютері немає програми.','warn');
}
OS.openNode=openNode;

/* =====================================================================
   ПЕРЕГЛЯД ПАПКИ (робочий стіл і провідник)
   ===================================================================== */
let clip=null;
const views=new Set();
function View(el,pid,mode,owner){
  const V={el,pid,mode,sel:new Set(),owner};views.add(V);
  const CW=()=>small()?84:104,CH=()=>small()?96:106;
  V.items=()=>F.kids(V.pid);
  V.render=()=>{
    const ids=new Set(V.items().map(n=>n.id));V.sel.forEach(id=>{if(!ids.has(id))V.sel.delete(id)});
    el.querySelectorAll('.sos-it').forEach(x=>x.remove());
    let list=V.items();
    if(mode==='desk'){
      const rows=Math.max(1,Math.floor((el.clientHeight-8)/CH())),used=new Set(),cells=[];
      const sys=[{id:'@bin',sysicon:1}];
      const all=[...list,{id:'@bin',bin:1}];
      all.forEach(n=>{const p=S.pos[n.id];if(p&&p[1]<rows&&!used.has(p+'')){used.add(p+'');cells.push([n,p])}});
      all.forEach(n=>{if(cells.some(c=>c[0]===n))return;let c=0,r=0;while(used.has([c,r]+'')){r++;if(r>=rows){r=0;c++}}used.add([c,r]+'');cells.push([n,[c,r]])});
      cells.forEach(([n,[c,r]])=>{const it=n.bin?binIcon():itemEl(n);it.style.left=(6+c*CW())+'px';it.style.top=(6+r*CH())+'px';it._cell=[c,r];el.appendChild(it)});
    }else{
      list.forEach(n=>el.appendChild(itemEl(n)));
      if(!list.length&&!el.querySelector('.sos-empty'))el.insertAdjacentHTML('beforeend','<div class="sos-empty">Ця папка порожня</div>');
      if(list.length)el.querySelectorAll('.sos-empty').forEach(x=>x.remove());
    }
    V.onRender&&V.onRender();
  };
  function binIcon(){const full=F.kids('trash').length>0;const it=h(`<div class="sos-it" data-id="@bin" data-drop="trash"><div class="ic">${full?I.binFull:I.bin}</div><div class="nm">Кошик</div></div>`);if(V.sel.has('@bin'))it.classList.add('sel');return it}
  function itemEl(n){
    const it=h(`<div class="sos-it${n.ext==='lnk'?' sos-lnk':''}" data-id="${n.id}"${n.type==='dir'?' data-drop="'+n.id+'"':''} title="${esc(F.full(n))}"><div class="ic" style="position:relative">${F.icon(n)}${n.ext==='lnk'?'<span class="sos-arrow">'+I.lnk+'</span>':''}</div><div class="nm">${esc(n.name)}</div></div>`);
    if(V.sel.has(n.id))it.classList.add('sel');if(clip&&clip.mode==='cut'&&clip.ids.includes(n.id))it.classList.add('cut');return it}
  V.select=(id,add)=>{if(id)act({t:'select',desk:mode==='desk'});if(!add)V.sel.clear();if(id)V.sel.has(id)&&add?V.sel.delete(id):V.sel.add(id);el.querySelectorAll('.sos-it').forEach(x=>x.classList.toggle('sel',V.sel.has(x.dataset.id)));V.onSel&&V.onSel()};
  V.selNodes=()=>[...V.sel].filter(id=>id[0]!=='@').map(F.get).filter(Boolean);
  /* події мишки */
  let lastTap={id:null,t:0};
  el.addEventListener('pointerdown',e=>{
    focusView(V);
    const it=e.target.closest('.sos-it');if(e.target.closest('.sos-ren'))return;if(!V.pid)return;
    if(!it){if(e.button===0&&!e.ctrlKey){V.select(null);band(e)}return}
    const id=it.dataset.id;
    if(e.button===2){if(!V.sel.has(id))V.select(id);return}
    if(e.button!==0)return;
    if(e.ctrlKey||e.metaKey){V.select(id,true);return}
    if(!V.sel.has(id))V.select(id);
    const now=Date.now();const dbl=lastTap.id===id&&now-lastTap.t<500;lastTap={id,t:now};
    if(dbl){lastTap={id:null,t:0};V.openSel();return}
    if(id!=='@bin'||mode==='desk')dragStart(e,it);
  });
  el.addEventListener('contextmenu',e=>{e.preventDefault();if(!V.pid){menu(e.clientX,e.clientY,[{t:'Оновити',icon:L.reload,f:()=>V.nav&&V.nav('@pc')}]);return}const it=e.target.closest('.sos-it');
    if(it){if(!V.sel.has(it.dataset.id))V.select(it.dataset.id);itemMenu(V,e.clientX,e.clientY)}else{V.select(null);bgMenu(V,e.clientX,e.clientY)}});
  V.openSel=()=>{const s=[...V.sel];if(s.includes('@bin')){openApp('bin');return}V.selNodes().forEach(n=>{if(V.mode==='list'&&n.type==='dir'&&V.nav)V.nav(n.id);else openNode(n)})};
  /* рамка виділення */
  function band(e){const r0=el.getBoundingClientRect();const sx=e.clientX-r0.left+el.scrollLeft,sy=e.clientY-r0.top+el.scrollTop;let b=null;
    const mv=ev=>{const x=ev.clientX-r0.left+el.scrollLeft,y=ev.clientY-r0.top+el.scrollTop;if(!b){if(Math.hypot(x-sx,y-sy)<6)return;b=h('<div class="sx-band"></div>');el.appendChild(b)}
      const L0=Math.min(x,sx),T0=Math.min(y,sy),W0=Math.abs(x-sx),H0=Math.abs(y-sy);Object.assign(b.style,{left:L0+'px',top:T0+'px',width:W0+'px',height:H0+'px'});
      const br=b.getBoundingClientRect();V.sel.clear();el.querySelectorAll('.sos-it').forEach(it=>{const r=it.getBoundingClientRect();const hit=r.left<br.right&&r.right>br.left&&r.top<br.bottom&&r.bottom>br.top;it.classList.toggle('sel',hit);if(hit)V.sel.add(it.dataset.id)})};
    const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);b&&b.remove();V.onSel&&V.onSel()};
    addEventListener('pointermove',mv);addEventListener('pointerup',up)}
  return V;
}
let curView=null;function focusView(V){curView=V}
OS.views=views;
OS.on('fs',()=>views.forEach(v=>{if(document.body.contains(v.el))v.render();else views.delete(v)}));

/* ---------- перетягування файлів ---------- */
function dragStart(e,it){
  const V=[...views].find(v=>v.el.contains(it));if(!V)return;
  const sx=e.clientX,sy=e.clientY;let g=null,over=null;
  const ids=()=>[...V.sel];
  const mv=ev=>{
    if(!g){if(Math.hypot(ev.clientX-sx,ev.clientY-sy)<6)return;
      g=h('<div class="sos-ghost"></div>');const c=it.cloneNode(true);c.style.left=c.style.top='';g.appendChild(c);const n=ids().length;if(n>1)g.insertAdjacentHTML('beforeend','<b>'+n+'</b>');root.appendChild(g);root.classList.add('dragging')}
    g.style.left=ev.clientX+'px';g.style.top=ev.clientY+'px';
    const t=document.elementFromPoint(ev.clientX,ev.clientY);let d=t&&t.closest('[data-drop]');
    if(d&&d.classList.contains('sos-it')&&V.sel.has(d.dataset.id))d=null;
    if(over!==d){over&&over.classList.remove('sos-drop-over','over');over=d;d&&d.classList.add(d.classList.contains('sos-it')?'over':'sos-drop-over')}};
  const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);root.classList.remove('dragging');over&&over.classList.remove('sos-drop-over','over');
    if(!g)return;g.remove();
    const sel=ids().filter(id=>id[0]!=='@');
    if(over){const to=over.dataset.drop;
      if(to==='trash'){if(V.pid==='trash')return;let k=0;sel.forEach(id=>{if(F.del(id))k++});if(k)snd('trash');return}
      if(to===V.pid&&V.mode!=='desk')return;
      if(to!==V.pid){let k=0;const copy=ev.ctrlKey;sel.forEach(id=>{if(copy?F.copy(id,to):F.move(id,to))k++});if(k)snd('click');
        if(to==='desk'&&V.mode!=='desk')return;if(to!=='desk'||V.mode==='desk')return}
    }
    /* вільне розташування на робочому столі */
    if(V.mode==='desk'){const t=document.elementFromPoint(ev.clientX,ev.clientY);if(!t||!V.el.contains(t)&&t!==V.el)return;
      const r=V.el.getBoundingClientRect(),CW=small()?84:104,CH=small()?96:106,rows=Math.max(1,Math.floor((V.el.clientHeight-8)/CH));
      const dc=Math.round((ev.clientX-sx)/CW),dr=Math.round((ev.clientY-sy)/CH);if(!dc&&!dr)return;
      const occ=new Map();V.el.querySelectorAll('.sos-it').forEach(x=>occ.set(x._cell+'',x.dataset.id));
      [...V.sel].forEach(id=>{const x=V.el.querySelector('[data-id="'+id+'"]');if(!x)return;let c=Math.max(0,x._cell[0]+dc),rr=Math.max(0,Math.min(rows-1,x._cell[1]+dr));
        const o=occ.get([c,rr]+'');if(o&&!V.sel.has(o)){S.pos[o]=x._cell.slice()}S.pos[id]=[c,rr]});
      save();V.render();act({t:'arrange'})}
  };
  addEventListener('pointermove',mv);addEventListener('pointerup',up);
}

/* ---------- дії з файлами ---------- */
function newIn(pid,kind){
  let n;act({t:'mk',type:kind==='dir'?'dir':'file',pid});if(kind==='dir')n=F.mk(pid,'Нова папка','dir');else if(kind==='txt')n=F.mk(pid,'Текстовий документ','file','txt','');
  snd('click');setTimeout(()=>{views.forEach(v=>{if(v.pid===pid&&document.body.contains(v.el)){v.select(n.id);startRename(v,n.id)}})},20);return n;
}
OS.newIn=newIn;
function startRename(V,id){
  const n=F.get(id);if(!n)return;if(n.sys){msg('Перейменування','«'+n.name+'» — системна папка, її не можна перейменувати.','warn');return}
  const it=V.el.querySelector('[data-id="'+id+'"]');if(!it)return;const nm=$('.nm',it);
  const ta=h('<textarea class="sos-ren" rows="2" spellcheck="false" aria-label="Нова назва"></textarea>');ta.value=n.name;nm.replaceWith(ta);ta.focus();ta.select();bindLang(ta);
  let done=false;const fin=ok=>{if(done)return;done=true;if(ok&&!F.rename(id,ta.value)){done=false;ta.focus();ta.select();return}V.render()};
  ta.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();fin(true)}else if(e.key==='Escape'){e.preventDefault();fin(false)}});
  ta.addEventListener('blur',()=>setTimeout(()=>fin(true),0));ta.addEventListener('pointerdown',e=>e.stopPropagation());
}
async function delSel(V,forever){
  const ns=V.selNodes();if(!ns.length)return;
  if(V.pid==='trash'||forever){const ok=await OS.confirm('Видалити назавжди',ns.length===1?'Видалити «'+F.full(ns[0])+'» назавжди? Повернути його вже не вийде.':'Видалити '+plural(ns.length,'об\'єкт','об\'єкти','об\'єктів')+' назавжди? Повернути їх уже не вийде.','Так, видалити','Ні','warn');
    if(!ok)return;ns.forEach(n=>F.purge(n.id));snd('empty');return}
  let k=0;ns.forEach(n=>{if(F.del(n.id))k++});if(k)snd('trash');
}
function copySel(V,mode){const ids=V.selNodes().filter(n=>!n.sys).map(n=>n.id);if(!ids.length)return;clip={mode,ids};views.forEach(v=>v.render());snd('click');act({t:mode})}
function paste(pid){if(!clip)return;let k=0;const mode=clip.mode;clip.ids.forEach(id=>{if(!F.get(id))return;if(clip.mode==='cut'?F.move(id,pid):F.copy(id,pid))k++});if(clip.mode==='cut')clip=null;if(k){snd('click');act({t:'paste',mode})}views.forEach(v=>v.render())}
function props(n){
  if(!n)return;const p=F.path(n.id).map(x=>x.name.replace('Локальний диск (C:)','C:')).join('\\');
  const lines=['Назва: '+F.full(n),'Тип: '+F.typeName(n),'Розташування: '+p.split('\\').slice(0,-1).join('\\'),'Розмір: '+fmtSize(F.size(n))];
  if(n.type==='dir')lines.push('Містить: '+plural(F.count(n.id),'об\'єкт','об\'єкти','об\'єктів'));
  if(n.ct)lines.push('Створено: '+fmtDate(n.ct));if(n.mt)lines.push('Змінено: '+fmtDate(n.mt));
  msg('Властивості: '+n.name,lines.join('\n'),n.type==='dir'?'folder':'info');
}
function itemMenu(V,x,y){act({t:'ctx'});
  const ns=V.selNodes(),one=ns.length===1?ns[0]:null;
  if(V.sel.has('@bin')){const e=!F.kids('trash').length;menu(x,y,[{t:'Відкрити',icon:I.bin,f:()=>openApp('bin')},'-',{t:'Очистити кошик',icon:I.err,dis:e,f:emptyBin}]);return}
  if(V.pid==='trash'){menu(x,y,[{t:'Відновити',icon:L.restore,f:()=>{ns.forEach(n=>F.restore(n.id));snd('click')}},{t:'Видалити назавжди',icon:L.del,f:()=>delSel(V,true)},'-',{t:'Властивості',icon:I.info,dis:!one,f:()=>props(one)}]);return}
  const sys=ns.some(n=>n.sys);
  menu(x,y,[{t:'Відкрити',icon:one?F.icon(one):I.folder,f:()=>V.openSel()},
   one&&one.ext==='png'?{t:'Зробити фоном робочого столу',icon:L.wall,f:()=>setWall('img:'+one.id,1)}:null,
   one&&one.ext==='png'?{t:'Змінити в Малювалці',icon:I.paint,f:()=>openApp('paint',one.id)}:null,
   one&&one.ext==='txt'?{t:'Відкрити в Блокноті',icon:I.notepad,f:()=>openApp('notepad',one.id)}:null,
   '-',{t:'Вирізати',icon:L.cut,k:'Ctrl+X',dis:sys,f:()=>copySel(V,'cut')},{t:'Копіювати',icon:L.copy,k:'Ctrl+C',dis:sys,f:()=>copySel(V,'copy')},
   one&&one.type==='dir'?{t:'Вставити сюди',icon:L.paste,k:'',dis:!clip,f:()=>paste(one.id)}:null,
   '-',{t:'Видалити',icon:L.del,k:'Delete',dis:sys,f:()=>delSel(V)},{t:'Перейменувати',icon:L.ren,k:'F2',dis:!one||sys,f:()=>startRename(V,one.id)},
   '-',{t:'Властивості',icon:I.info,dis:!one,f:()=>props(one)}]);
}
function bgMenu(V,x,y){act({t:'ctx'});
  if(V.pid==='trash'){menu(x,y,[{t:'Очистити кошик',icon:I.err,dis:!F.kids('trash').length,f:emptyBin},{t:'Відновити все',icon:L.restore,dis:!F.kids('trash').length,f:()=>{F.kids('trash').forEach(n=>F.restore(n.id));snd('click')}}]);return}
  const items=[{t:'Оновити',icon:L.reload,f:()=>refresh(V)},'-',
   {t:'Вставити',icon:L.paste,k:'Ctrl+V',dis:!clip,f:()=>paste(V.pid)},'-',
   {t:'Створити',icon:L.newf,sub:[{t:'Папку',icon:I.folder,f:()=>newIn(V.pid,'dir')},{t:'Текстовий документ',icon:I.txt,f:()=>newIn(V.pid,'txt')}]}];
  if(V.mode==='desk')items.push('-',{t:'Упорядкувати значки',icon:L.wall,f:()=>{F.kids('desk').forEach(n=>delete S.pos[n.id]);delete S.pos['@bin'];save();V.render()}},{t:'Змінити шпалери',icon:L.wall,f:()=>openApp('settings','wall')});
  else items.push('-',{t:'Властивості',icon:I.info,f:()=>props(F.get(V.pid))});
  menu(x,y,items);
}
function refresh(V){V.el.classList.add('sos-refresh');V.render();snd('click');setTimeout(()=>V.el.classList.remove('sos-refresh'),400)}
async function emptyBin(){const k=F.kids('trash');if(!k.length)return;const ok=await OS.confirm('Очистити кошик','Видалити назавжди '+plural(k.length,'об\'єкт','об\'єкти','об\'єктів')+' з кошика?','Так, очистити','Ні','warn');if(!ok)return;k.forEach(n=>F.purge(n.id));snd('empty')}
OS.emptyBin=emptyBin;

/* ---------- клавіатура ---------- */
document.addEventListener('keydown',e=>{
  if(!root.isConnected||root.hidden)return;
  if(e.altKey&&e.shiftKey&&(e.key==='Shift'||e.key==='Alt')){OS.toggleLang();return}
  if(e.ctrlKey&&e.shiftKey&&e.code==='Space'){}
  const t=e.target;if(t.closest&&t.closest('.sos-modal'))return;
  if(e.key==='Escape'){if(menuEl){closeMenu();return}if(startEl){closeStart();return}if(popEl){closePop();return}}
  if(active&&active.onKey&&!active.el.classList.contains('min')&&(active.el.contains(t)||t===document.body||t===document.documentElement||(root.contains(t)&&!t.closest('.sw,input,textarea')))&&active.onKey(e)===true){e.preventDefault();return}
  if(t.matches&&t.matches('input,textarea,[contenteditable=true]'))return;
  const V=curView&&document.body.contains(curView.el)?curView:null;
  if(e.key==='F5'){e.preventDefault();V&&refresh(V);return}
  if(!V)return;
  if(V.owner&&active!==V.owner)return;
  if(!V.owner&&active&&!active.el.classList.contains('min'))return;
  const k=e.key,ctrl=e.ctrlKey||e.metaKey;via='key';setTimeout(()=>via='mouse',0);
  if(k==='Delete'){e.preventDefault();delSel(V,e.shiftKey)}
  else if(k==='F2'){e.preventDefault();const n=V.selNodes()[0];n&&startRename(V,n.id)}
  else if(k==='Enter'){e.preventDefault();V.openSel()}
  else if(ctrl&&e.code==='KeyA'){e.preventDefault();V.sel.clear();V.items().forEach(n=>V.sel.add(n.id));V.render();V.onSel&&V.onSel()}
  else if(ctrl&&e.code==='KeyC'){e.preventDefault();copySel(V,'copy')}
  else if(ctrl&&e.code==='KeyX'){e.preventDefault();copySel(V,'cut')}
  else if(ctrl&&e.code==='KeyV'){e.preventDefault();paste(V.pid)}
  else if(k==='Backspace'&&V.back){e.preventDefault();V.up&&V.up()}
});
root.addEventListener('contextmenu',e=>{if(!e.target.closest('input,textarea,[contenteditable=true],.sos-it,.sos-icons,.sx-view'))e.preventDefault()});

/* =====================================================================
   ПУСК
   ===================================================================== */
let startEl=null;const startB=$('.sos-startb',root);
function closeStart(){if(startEl){startEl.remove();startEl=null;startB.classList.remove('on')}}
OS.closeStart=closeStart;
function openStart(){
  closePop();if(startEl){closeStart();return}
  const me=window.ITMW&&ITMW.me&&ITMW.me();const nm=me?me.name:(opt.user||'Учень');const ini=nm.split(/\s+/).map(s=>s[0]).join('').slice(0,2).toUpperCase();
  startEl=h(`<div class="sos-start" role="dialog" aria-label="Пуск"><div class="sos-sq">${L.search}<input type="search" placeholder="Пошук програм і файлів" aria-label="Пошук"></div><div class="sos-sbody"></div>
   <div class="sos-sfoot"><button class="sos-user" title="${me?'Змінити учня':'Увійти'}"><span>${esc(ini)}</span><b>${esc(nm)}</b></button><button class="sos-pw" title="Живлення" aria-label="Живлення">${L.power}</button></div></div>`);
  root.appendChild(startEl);startB.classList.add('on');snd('click');act({t:'start'});
  const q=$('input',startEl),body=$('.sos-sbody',startEl);
  const all=Object.values(OS.apps).filter(a=>!a.hidden);
  const appBtn=a=>`<button class="sos-app" data-app="${a.id}"><i>${a.icon}</i>${esc(a.name)}</button>`;
  const draw=()=>{const s=q.value.trim().toLowerCase();
    if(!s){const pin=(opt.pinned||['pc','browser','notepad','paint','calc','calendar','photos','settings','bin']).map(id=>OS.apps[id]).filter(Boolean);
      let html='<h4>Закріплені</h4><div class="sos-grid">'+pin.map(appBtn).join('')+'</div>';
      [['trainer','Тренажери'],['game','Ігри'],['tool','Інструменти'],['extra',opt.extraTitle||'Програми']].forEach(([c,t])=>{const l=all.filter(a=>a.cat===c);if(l.length)html+='<h4>'+t+'</h4><div class="sos-grid">'+l.map(appBtn).join('')+'</div>'});
      body.innerHTML=html;return}
    const ap=all.filter(a=>a.name.toLowerCase().includes(s)||(a.kw||'').toLowerCase().includes(s));const fl=F.find(s);
    let html='';if(ap.length)html+='<h4>Програми</h4>'+ap.map(a=>`<button class="sos-row" data-app="${a.id}"><i>${a.icon}</i><span>${esc(a.name)}<small>Програма</small></span></button>`).join('');
    if(fl.length)html+='<h4>Файли й папки</h4>'+fl.map(n=>`<button class="sos-row" data-node="${n.id}"><i>${F.icon(n)}</i><span>${esc(F.full(n))}<small>${esc(F.path(n.parent).map(x=>x.name.replace('Локальний диск (C:)','C:')).join(' › '))}</small></span></button>`).join('');
    body.innerHTML=html||'<div class="sos-empty">Нічого не знайдено за запитом «'+esc(q.value)+'»</div>';
    const f=body.querySelector('[data-app],[data-node]');f&&f.classList.add('hl')};
  draw();q.addEventListener('input',draw);
  q.addEventListener('keydown',e=>{if(e.key==='Enter'){const f=body.querySelector('.hl')||body.querySelector('[data-app],[data-node]');f&&f.click()}});
  body.addEventListener('click',e=>{const b=e.target.closest('[data-app],[data-node]');if(!b)return;closeStart();if(b.dataset.app)act({t:'startopen',app:b.dataset.app});if(b.dataset.app)openApp(b.dataset.app);else openNode(F.get(b.dataset.node))});
  $('.sos-user',startEl).onclick=()=>{closeStart();if(window.ITMW&&ITMW.open)ITMW.open()};
  $('.sos-pw',startEl).onclick=e=>{const r=e.currentTarget.getBoundingClientRect();menu(r.left-150,r.top-(opt.lock?260:170),[
    {t:'На весь екран',icon:L.full,f:()=>{closeStart();const d=document.documentElement;if(document.fullscreenElement)document.exitFullscreen();else d.requestFullscreen&&d.requestFullscreen().catch(()=>{})}},
    ...(opt.lock?[{t:'Змінити користувача',icon:L.about,f:()=>{closeStart();lock()}},{t:'Заблокувати',icon:L.about,f:()=>{closeStart();lock()}}]:[]),{t:'Перезавантажити',icon:L.reload,f:()=>{closeStart();reboot()}},{t:'Вимкнути',icon:L.power,f:()=>{closeStart();shutdown()}}])};
  if(!small())setTimeout(()=>q.focus(),30);
}
startB.onclick=openStart;
document.addEventListener('keydown',e=>{if(root.hidden)return;if((e.key==='Meta'||e.key==='OS')&&!e.repeat){}if(e.ctrlKey&&e.key==='Escape'){e.preventDefault();openStart()}});
let metaOnly=false;document.addEventListener('keydown',e=>{metaOnly=e.key==='Meta'});document.addEventListener('keyup',e=>{if(e.key==='Meta'&&metaOnly&&!root.hidden){openStart()}metaOnly=false});

/* ---------- завантаження / вимкнення ---------- */
function bootScreen(text,ms){return new Promise(r=>{const b=h(`<div class="sos-boot">${I.logo}<div class="dots"><i></i><i></i><i></i></div><b>${esc(text)}</b></div>`);root.appendChild(b);
  const red=matchMedia('(prefers-reduced-motion: reduce)').matches;setTimeout(()=>{b.style.opacity='0';setTimeout(()=>{b.remove();r()},red?10:400)},red?200:ms)})}
async function reboot(){for(const w of [...OS.wins]){await w.close();if(OS.wins.includes(w))return}saveNow();bootScreen('Перезавантаження…',1300).then(()=>{if(opt.lock)lock();else{snd('boot');views.forEach(v=>v.render())}})}
async function shutdown(){for(const w of [...OS.wins]){await w.close();if(OS.wins.includes(w))return}saveNow();const b=h(`<div class="sos-boot">${I.logo}<b>Вимикання…</b></div>`);root.appendChild(b);
  setTimeout(()=>{b.remove();emit('shutdown');const off=h(`<div class="sos-off"><button aria-label="Увімкнути" title="Увімкнути">${L.power}</button><span>Комп'ютер вимкнено</span></div>`);root.appendChild(off);
    $('button',off).onclick=()=>{off.remove();bootScreen('Вмикаємо комп\'ютер…',1100).then(()=>{snd('boot');if(opt.lock)lock();else{desktopView.render();emit('ready')}})}},900)}
function lock(){return new Promise(res=>{
  closeStart();closeMenu();closePop();
  const me=window.ITMW&&ITMW.me&&ITMW.me();const nm=me?me.name:'Учень';const ini=me?nm.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase():'';
  const w={css:wallCss()};const d=new Date();
  const el=h(`<div class="sos-lock" style="background:${w.css}"><div class="lt"><b></b><span></span></div><div class="hint">Натисни будь-де або будь-яку клавішу</div>
    <div class="sos-login"><div class="sos-av">${ini?esc(ini):'<svg viewBox="0 0 24 24" fill="#4c5482"><circle cx="12" cy="8" r="4.5"/><path d="M3.5 21a8.5 8.5 0 0 1 17 0z"/></svg>'}</div><h2>${esc(nm)}</h2>${me?'<small>'+esc(me.cls||'')+'</small>':''}
    <button class="sos-go">Увійти ${L.fwd}</button>${window.ITMW&&ITMW.open?'<button class="sos-sw">'+(me?'Інший учень':'Увійти під своїм іменем')+'</button>':''}</div>
    <div class="corner"><button class="lg" title="Мова" aria-label="Мова" style="font:800 14px Nunito,sans-serif">${S.lang==='ua'?'UA':'EN'}</button><button class="pw" title="Вимкнути" aria-label="Вимкнути">${L.power}</button></div></div>`);
  const tk=()=>{const n=new Date();$('.lt b',el).textContent=pad(n.getHours())+':'+pad(n.getMinutes());$('.lt span',el).textContent=DAYS[n.getDay()]+', '+n.getDate()+' '+MONTHS_G[n.getMonth()]};tk();const ti=setInterval(tk,5000);
  root.appendChild(el);
  const toLogin=()=>{if(el.classList.contains('login'))return;el.classList.add('login');snd('click');setTimeout(()=>{const g=$('.sos-go',el);g&&g.focus()},60)};
  const enter=()=>{clearInterval(ti);document.removeEventListener('keydown',kd,true);snd('boot');
    el.innerHTML=`<div class="sos-welcome">Ласкаво просимо</div>`;setTimeout(()=>{el.style.opacity='0';setTimeout(()=>{el.remove();desktopView.render();emit('ready');res()},350)},700)};
  const kd=e=>{if(!el.isConnected)return;if(e.key==='Tab')return;if(!e.target.closest||!e.target.closest('dialog'))e.stopPropagation();else return;if(!el.classList.contains('login')){e.preventDefault();toLogin();return}if(e.key==='Enter'&&e.target.closest&&!e.target.closest('.sos-sw,.corner')){e.preventDefault();enter()}if(e.key==='Escape')el.classList.remove('login')};
  document.addEventListener('keydown',kd,true);
  el.addEventListener('pointerdown',e=>{if(!el.classList.contains('login')&&!e.target.closest('.corner'))toLogin()});
  $('.sos-go',el).onclick=enter;
  const swb=$('.sos-sw',el);if(swb)swb.onclick=()=>ITMW.open();
  $('.lg',el).onclick=e=>{e.stopPropagation();OS.toggleLang();e.currentTarget.textContent=S.lang==='ua'?'UA':'EN'};
  $('.pw',el).onclick=e=>{e.stopPropagation();clearInterval(ti);document.removeEventListener('keydown',kd,true);el.remove();shutdown()};
})}
OS.lock=lock;
OS.reboot=reboot;OS.shutdown=shutdown;OS.bootScreen=bootScreen;
OS.reset=async()=>{OS.wins.slice().forEach(w=>w.close(true));localStorage.removeItem(opt.key);S=defaults();saveNow();setWall(S.wall);setLang(S.lang);drawSnd();await bootScreen('Повертаємо все як було…',1100);desktopView.render();notify('Комп\'ютер як новий','Усі файли й налаштування повернуто до початкових.','info')};

/* =====================================================================
   ВБУДОВАНІ ПРОГРАМИ
   ===================================================================== */
/* --- Провідник --- */
register({id:'pc',name:'Мій комп\'ютер',icon:I.pc,kw:'провідник файли диск',open:()=>openApp('explorer','@pc')});
register({id:'explorer',name:'Провідник',icon:I.folder,hidden:1,kw:'папки файли',open:(start)=>{
  const W=win({app:'explorer',title:'Провідник',icon:I.folder,w:820,h:520});
  W.body.innerHTML=`<div class="sx-tool"><button class="b" title="Назад">${L.back}</button><button class="f" title="Вперед">${L.fwd}</button><button class="u" title="На рівень вище">${L.up}</button><div class="sx-addr"></div>
   <button class="nf" title="Нова папка">${L.newf}<span class="lbl">Нова папка</span></button><button class="dl" title="Видалити (Delete)">${L.del}</button></div>
   <div class="sx-main"><div class="sx-side"></div><div class="sx-view" tabindex="-1"></div></div><div class="sx-status"></div>`;
  const view=$('.sx-view',W.body),side=$('.sx-side',W.body),addr=$('.sx-addr',W.body),status=$('.sx-status',W.body);
  if(small())$('.lbl',W.body).remove();
  const V=View(view,null,'list',W);V.back=true;
  let hist=[],hi=-1,cur=null;
  const quick=[['@pc','Мій комп\'ютер',I.pc],['desk','Робочий стіл',I.folderBadge(I.pc)],['docs','Документи',I.folderBadge(I.txt)],['pics','Малюнки',I.folderBadge(I.img)],['down','Завантаження',I.folderBadge(I.down)],['music','Музика',I.folder],['c','Диск C:',I.drive],['@bin','Кошик',I.bin]];
  side.innerHTML=quick.map(([id,n,ic],i)=>(i===1||i===6?'<hr>':'')+`<button data-go="${id}"${id[0]!=='@'?' data-drop="'+id+'"':id==='@bin'?' data-drop="trash"':''}><i>${ic}</i>${esc(n)}</button>`).join('');
  side.onclick=e=>{const b=e.target.closest('[data-go]');if(!b)return;if(b.dataset.go==='@bin'){openApp('bin');return}go(b.dataset.go)};
  function go(id,nohist){
    if(id!=='@pc'&&!F.get(id))id='@pc';if(id!=='@pc'&&F.isIn(id,'trash'))id='@pc';
    cur=id;if(!nohist){hist=hist.slice(0,hi+1);hist.push(id);hi=hist.length-1}
    view.innerHTML='';V.sel.clear();
    if(id==='@pc'){V.pid=null;view.removeAttribute('data-drop');
      const used=OS.usage(),pct=Math.min(100,used/CAP*100);
      view.innerHTML=`<div class="sx-h">Папки</div><div class="sx-pcf"></div><div class="sx-h">Пристрої та диски</div><div class="sx-drives"><button class="sx-drive" data-open="c"><i>${I.drive}</i><div><b>Локальний диск (C:)</b><div class="sx-meter"><i style="width:${pct.toFixed(1)}%"></i></div><small>Вільно ${fmtSize(Math.max(0,CAP-used))} з ${fmtSize(CAP)}</small></div></button></div>`;
      const pf=$('.sx-pcf',view);['desk','docs','pics','down','music'].forEach(fid=>{const n=F.get(fid);const it=h(`<div class="sos-it" data-pcopen="${fid}" data-drop="${fid}"><div class="ic">${F.icon(n)}</div><div class="nm">${esc(n.name)}</div></div>`);pf.appendChild(it)});
      view.querySelectorAll('[data-open],[data-pcopen]').forEach(b=>{let t=0;b.addEventListener('pointerdown',e=>{view.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');const now=Date.now();if(now-t<500)go(b.dataset.open||b.dataset.pcopen);t=now})});
      W.setTitle('Мій комп\'ютер');W.setIcon(I.pc);
    }else{V.pid=id;view.dataset.drop=id;V.render();const n=F.get(id);W.setTitle(n.name);W.setIcon(id==='c'?I.drive:I.folder)}
    drawAddr();drawStatus();side.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.go===id));
    $('.b',W.body).disabled=hi<=0;$('.f',W.body).disabled=hi>=hist.length-1;$('.u',W.body).disabled=id==='@pc';$('.nf',W.body).disabled=id==='@pc';$('.dl',W.body).disabled=true;
  }
  function drawAddr(){if(cur==='@pc'){addr.innerHTML=`<button data-go="@pc">Мій комп'ютер</button>`;return}
    addr.innerHTML=`<button data-go="@pc">Мій комп'ютер</button>`+F.path(cur).map(n=>`<span>›</span><button data-go="${n.id}">${esc(n.id==='c'?'Диск C:':n.name)}</button>`).join('');addr.scrollLeft=9999}
  addr.onclick=e=>{const b=e.target.closest('[data-go]');b&&go(b.dataset.go)};
  function drawStatus(){if(cur==='@pc'){status.textContent='';return}const k=F.kids(cur).length,s=V.sel.size;status.textContent=plural(k,'елемент','елементи','елементів')+(s?' · вибрано '+s:'')}
  V.onSel=()=>{drawStatus();$('.dl',W.body).disabled=!V.selNodes().length};V.onRender=drawStatus;
  V.nav=id=>go(id);V.up=()=>{if(cur==='@pc')return;const n=F.get(cur);go(n&&n.parent?n.parent:'@pc')};
  $('.b',W.body).onclick=()=>{if(hi>0){hi--;go(hist[hi],1)}};$('.f',W.body).onclick=()=>{if(hi<hist.length-1){hi++;go(hist[hi],1)}};$('.u',W.body).onclick=V.up;
  $('.nf',W.body).onclick=()=>newIn(cur,'dir');$('.dl',W.body).onclick=()=>delSel(V);
  W.onArg=id=>go(id);
  const off=()=>{};OS.on('fs',()=>{if(!W.el.isConnected)return;if(cur!=='@pc'&&(!F.get(cur)||F.isIn(cur,'trash')))go('@pc');else if(cur==='@pc')go('@pc',1);drawAddr()});
  W.onFocus=()=>focusView(V);
  go(start||'@pc');focusView(V);
  return W;
}});
/* --- Кошик --- */
register({id:'bin',name:'Кошик',icon:I.bin,single:true,kw:'видалені смітник',open:()=>{
  const W=win({app:'bin',title:'Кошик',icon:I.bin,w:720,h:460});
  W.body.innerHTML=`<div class="sx-tool"><button class="e">${L.trash}<span>Очистити кошик</span></button><button class="r">${L.restore}<span>Відновити все</span></button><button class="rs" disabled>${L.restore}<span>Відновити вибране</span></button></div>
   <div class="sx-main"><div class="sx-view" tabindex="-1" data-drop="trash"></div></div><div class="sx-status"></div>`;
  const view=$('.sx-view',W.body),status=$('.sx-status',W.body);
  const V=View(view,'trash','list',W);
  const upd=()=>{const k=F.kids('trash').length;status.textContent=k?plural(k,'об\'єкт','об\'єкти','об\'єктів')+' у кошику — їх можна відновити':'Кошик порожній';$('.e',W.body).disabled=!k;$('.r',W.body).disabled=!k;$('.rs',W.body).disabled=!V.selNodes().length;W.setIcon(k?I.binFull:I.bin)};
  V.onRender=upd;V.onSel=upd;V.render();
  V.openSel=()=>{const n=V.selNodes()[0];if(n)msg('Файл у кошику','Щоб відкрити «'+F.full(n)+'», спершу віднови його: права кнопка → «Відновити».','info')};
  $('.e',W.body).onclick=emptyBin;$('.r',W.body).onclick=()=>{F.kids('trash').forEach(n=>F.restore(n.id));snd('click')};$('.rs',W.body).onclick=()=>{V.selNodes().forEach(n=>F.restore(n.id));snd('click')};
  W.onFocus=()=>focusView(V);focusView(V);return W;
}});

/* --- діалог файлу (Відкрити / Зберегти як) --- */
function fileDialog({mode,ext,name,pid}){
  return new Promise(res=>{
    let cur=pid&&F.get(pid)?pid:(ext==='png'?'pics':'docs'),sel=null;
    const m=h(`<div class="sos-modal"><div class="sos-dlg" style="width:min(620px,calc(100% - 20px))"><div class="swt"><i>${I.folder}</i><b>${mode==='save'?'Зберегти як':'Відкрити'}</b><button class="x" aria-label="Закрити">${WB.x}</button></div>
     <div class="sx-tool"><button class="u" title="Вище">${L.up}</button><div class="sx-addr"></div><button class="nf" title="Нова папка">${L.newf}</button></div>
     <div class="sx-main" style="height:min(300px,45vh)"><div class="sx-side"></div><div class="sx-view"></div></div>
     <div class="df" style="align-items:center;flex-wrap:wrap"><label style="font-weight:800;font-size:14px">Назва файлу:</label><input class="fn" style="flex:1;min-width:150px;height:38px;border:2px solid #dcd5e8;border-radius:8px;padding:0 10px;font-weight:700;font-size:15px;outline:none" spellcheck="false"><span style="font-weight:800;color:#8a83a0">.${ext}</span>
     <button class="sos-btn p ok">${mode==='save'?'Зберегти':'Відкрити'}</button><button class="sos-btn no">Скасувати</button></div></div></div>`);
    const view=$('.sx-view',m),addr=$('.sx-addr',m),fn=$('.fn',m),side=$('.sx-side',m);
    side.innerHTML=[['desk','Робочий стіл'],['docs','Документи'],['pics','Малюнки'],['down','Завантаження'],['c','Диск C:']].map(([id,n])=>`<button data-go="${id}"><i>${I.folder}</i>${n}</button>`).join('');
    side.onclick=e=>{const b=e.target.closest('[data-go]');b&&draw(b.dataset.go)};
    fn.value=name||'';bindLang(fn);
    const done=v=>{m.remove();document.removeEventListener('keydown',kd,true);res(v)};
    function draw(id){cur=id;sel=null;view.innerHTML='';
      const list=F.kids(id).filter(n=>n.type==='dir'||n.ext===ext);
      list.forEach(n=>{const it=h(`<div class="sos-it" data-id="${n.id}"><div class="ic">${F.icon(n)}</div><div class="nm">${esc(n.name)}</div></div>`);let t=0;
        it.addEventListener('pointerdown',()=>{view.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));it.classList.add('sel');sel=n;if(n.type!=='dir')fn.value=n.name;const now=Date.now();if(now-t<500){if(n.type==='dir')draw(n.id);else ok()}t=now});view.appendChild(it)});
      if(!list.length)view.innerHTML='<div class="sos-empty">Тут немає '+(ext==='png'?'малюнків':'текстових файлів')+'</div>';
      addr.innerHTML=F.path(id).map(n=>`<button data-go="${n.id}">${esc(n.id==='c'?'Диск C:':n.name)}</button>`).join('<span>›</span>');
      side.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.go===id))}
    addr.onclick=e=>{const b=e.target.closest('[data-go]');b&&draw(b.dataset.go)};
    $('.u',m).onclick=()=>{const n=F.get(cur);if(n&&n.parent)draw(n.parent)};
    $('.nf',m).onclick=async()=>{const nm=await OS.prompt('Нова папка','Назва папки:','Нова папка');if(nm&&nm.trim()&&!BAD.test(nm)){F.mk(cur,nm.trim(),'dir');draw(cur)}};
    async function ok(){
      if(mode==='open'){if(sel&&sel.type!=='dir'){done(sel.id);return}const f=F.kids(cur).find(n=>n.ext===ext&&n.name.toLowerCase()===fn.value.trim().toLowerCase());if(f){done(f.id);return}msg('Відкрити','Обери файл зі списку.','warn');return}
      const nm=fn.value.trim();if(!nm){msg('Зберегти як','Напиши назву файлу.','warn');return}if(BAD.test(nm)){msg('Зберегти як','Назва не може містити ці знаки:\n\\ / : * ? " < > |','warn');return}
      const ex=F.kids(cur).find(n=>n.ext===ext&&n.name.toLowerCase()===nm.toLowerCase());
      if(ex){const r=await OS.confirm('Підтвердження','Файл «'+nm+'.'+ext+'» уже існує.\nЗамінити його?','Так, замінити','Ні','warn');if(!r)return;done({id:ex.id});return}
      done({pid:cur,name:nm})}
    $('.ok',m).onclick=ok;$('.no',m).onclick=()=>done(null);$('.x',m).onclick=()=>done(null);
    const kd=e=>{if(e.target.closest&&e.target.closest('.sos-modal')!==m&&document.querySelector('.sos-modal:last-child')!==m)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();done(null)}else if(e.key==='Enter'&&e.target===fn){e.preventDefault();e.stopPropagation();ok()}};
    document.addEventListener('keydown',kd,true);
    root.appendChild(m);draw(cur);setTimeout(()=>{fn.focus();fn.select()},30);
  });
}
OS.fileDialog=fileDialog;

/* --- меню-рядок для програм --- */
function menubar(W,spec){const bar=h('<div class="sm-bar"></div>');
  spec.forEach(([t,items])=>{const b=h(`<button>${esc(t)}</button>`);b.onclick=e=>{e.stopPropagation();const r=b.getBoundingClientRect();b.classList.add('on');const m=menu(r.left,r.bottom+2,typeof items==='function'?items():items);const obs=new MutationObserver(()=>{if(!m.isConnected){b.classList.remove('on');obs.disconnect()}});obs.observe(root,{childList:true})};bar.appendChild(b)});
  W.body.appendChild(bar);return bar}

/* --- Блокнот --- */
register({id:'notepad',name:'Блокнот',icon:I.notepad,kw:'текст notepad',open:(fid)=>{
  const W=win({app:'notepad',title:'Блокнот',icon:I.notepad,w:680,h:460});
  let file=fid&&F.get(fid)?fid:null,dirty=false,fs=17;
  menubar(W,[['Файл',()=>[{t:'Новий',k:'Ctrl+N',icon:L.newf,f:newDoc},{t:'Відкрити…',k:'Ctrl+O',icon:I.folder,f:openDoc},{t:'Зберегти',k:'Ctrl+S',icon:I.down,f:()=>saveDoc()},{t:'Зберегти як…',icon:I.down,f:()=>saveDoc(true)},'-',{t:'Вийти',icon:I.err,f:()=>W.close()}]],
   ['Правка',()=>[{t:'Виділити все',k:'Ctrl+A',f:()=>{ta.focus();ta.select()}},{t:'Дата й час',k:'F5',f:()=>ins(fmtDate(Date.now()))}]],
   ['Вигляд',()=>[{t:'Збільшити шрифт',k:'Ctrl++',f:()=>zoom(2)},{t:'Зменшити шрифт',k:'Ctrl+-',f:()=>zoom(-2)},{t:'Звичайний розмір',f:()=>zoom(0)}]]]);
  const ta=h('<textarea class="sn-ta" spellcheck="false" aria-label="Текст"></textarea>');W.body.appendChild(ta);
  const st=h('<div class="sn-st"><span class="p"></span><span class="c"></span><span class="lg"></span></div>');W.body.appendChild(st);
  const upd=()=>{const n=file&&F.get(file);W.setTitle((dirty?'*':'')+(n?n.name+'.txt':'Без назви')+' — Блокнот');const v=ta.value.slice(0,ta.selectionStart).split('\n');$('.p',st).textContent='Рядок '+v.length+', стовпець '+(v[v.length-1].length+1);$('.c',st).textContent=plural(ta.value.length,'символ','символи','символів');$('.lg',st).textContent=S.lang==='ua'?'Українська':'English'};
  const zoom=d=>{fs=d?Math.max(11,Math.min(40,fs+d)):17;ta.style.fontSize=fs+'px'};
  const ins=t=>{ta.focus();ta.setRangeText(t,ta.selectionStart,ta.selectionEnd,'end');dirty=true;upd()};
  function load(id){const n=F.get(id);file=id;ta.value=n?n.data||'':'';dirty=false;upd()}
  async function askSave(){if(!dirty)return true;const n=file&&F.get(file);const r=await dialog({title:'Блокнот',icon:'ask',text:'Зберегти зміни у файлі «'+(n?n.name+'.txt':'Без назви')+'»?',buttons:[{t:'Зберегти',v:'y',p:1},{t:'Не зберігати',v:'n'},{t:'Скасувати',v:null}]});
    if(r==='y')return await saveDoc();return r==='n'}
  async function newDoc(){if(!await askSave())return;file=null;ta.value='';dirty=false;upd()}
  async function openDoc(){if(!await askSave())return;const id=await fileDialog({mode:'open',ext:'txt',pid:file?F.get(file).parent:'docs'});if(id)load(id)}
  async function saveDoc(as){
    if(file&&!as&&F.get(file)&&!F.isIn(file,'trash')){F.write(file,ta.value);dirty=false;upd();act({t:'save',ext:'txt',len:ta.value.trim().length});return true}
    const r=await fileDialog({mode:'save',ext:'txt',name:file&&F.get(file)?F.get(file).name:'Без назви',pid:file&&F.get(file)?F.get(file).parent:'docs'});if(!r)return false;
    if(r.id){F.write(r.id,ta.value);file=r.id}else{const n=F.mk(r.pid,r.name,'file','txt',ta.value);file=n.id}
    dirty=false;upd();notify('Збережено',F.full(F.get(file)),'txt');act({t:'save',ext:'txt',len:ta.value.trim().length});return true}
  ta.addEventListener('input',()=>{dirty=true;upd()});['keyup','click'].forEach(e=>ta.addEventListener(e,upd));OS.on('settings',()=>W.el.isConnected&&upd());
  W.onKey=e=>{if(!(e.ctrlKey||e.metaKey)){if(e.key==='F5'){ins(fmtDate(Date.now()));return true}return}const c=e.code;
    if(c==='KeyS'){saveDoc(e.shiftKey);return true}if(c==='KeyO'){openDoc();return true}if(c==='KeyN'){newDoc();return true}
    if(e.key==='+'||e.key==='='){zoom(2);return true}if(e.key==='-'){zoom(-2);return true}};
  W.beforeClose=askSave;W.onArg=id=>{askSave().then(ok=>ok&&load(id))};
  if(file)load(file);else upd();setTimeout(()=>ta.focus(),50);
  return W;
}});

/* --- Малювалка --- */
register({id:'paint',name:'Малювалка',icon:I.paint,kw:'paint малювати графічний редактор пензлик',open:(fid)=>{
  const W=win({app:'paint',title:'Малювалка',icon:I.paint,w:960,h:640});
  const CW=800,CH=500;let file=null,dirty=false,tool='brush',size=6,color='#3b3450';
  menubar(W,[['Файл',()=>[{t:'Новий малюнок',k:'Ctrl+N',icon:L.newf,f:newPic},{t:'Відкрити…',k:'Ctrl+O',icon:I.folder,f:openPic},{t:'Зберегти',k:'Ctrl+S',icon:I.down,f:()=>savePic()},{t:'Зберегти як…',icon:I.down,f:()=>savePic(true)},'-',{t:'Вийти',icon:I.err,f:()=>W.close()}]],
   ['Правка',()=>[{t:'Скасувати',k:'Ctrl+Z',icon:L.undo,dis:!undo.length,f:doUndo},{t:'Повторити',k:'Ctrl+Y',icon:L.redo,dis:!redo.length,f:doRedo},'-',{t:'Очистити все',icon:L.trash,f:()=>{push();X.fillStyle='#fff';X.fillRect(0,0,CW,CH);dirty=true;upd()}}]]]);
  const COLS=['#3b3450','#ffffff','#9aa3ad','#e0574a','#f08a4b','#f3cf6b','#6fb38f','#2f9e6f','#6fa6d6','#3b6fd6','#8a7cf0','#f2b3c6','#8a5a3c','#000000'];
  const TOOLS=[['brush','Пензлик',L.brush],['pencil','Олівець',L.pencil],['eraser','Гумка',L.eraser],['fill','Заливка',L.fill],['line','Лінія',L.line],['rect','Прямокутник',L.rect],['oval','Овал',L.oval]];
  const tb=h(`<div class="sp-tools"><div class="grp">${TOOLS.map(([id,n,ic])=>`<button class="t" data-t="${id}" title="${n}" aria-label="${n}">${ic}</button>`).join('')}</div>
   <div class="grp">${[3,6,12,24].map(s=>`<button class="t sz" data-s="${s}" title="Товщина ${s}"><i style="width:${Math.min(20,s*.8+2)}px;height:${Math.min(20,s*.8+2)}px"></i></button>`).join('')}</div>
   <div class="grp"><span class="sp-cur" title="Свій колір"><input type="color" aria-label="Свій колір"></span>${COLS.map(c=>`<button class="sp-col" data-c="${c}" style="background:${c}" title="${c}" aria-label="Колір ${c}"></button>`).join('')}</div>
   <div class="grp"><button class="t" data-a="undo" title="Скасувати (Ctrl+Z)">${L.undo}</button><button class="t" data-a="redo" title="Повторити (Ctrl+Y)">${L.redo}</button></div></div>`);
  W.body.appendChild(tb);
  const area=h('<div class="sp-area"><div class="sp-wrap"><canvas></canvas><canvas></canvas></div></div>');W.body.appendChild(area);
  const [cv,ov]=area.querySelectorAll('canvas');cv.width=ov.width=CW;cv.height=ov.height=CH;
  const X=cv.getContext('2d',{willReadFrequently:true}),O=ov.getContext('2d');X.fillStyle='#fff';X.fillRect(0,0,CW,CH);
  const fit=()=>{const r=area.getBoundingClientRect();const k=Math.min(1,(r.width-28)/CW,(r.height-28)/CH);cv.style.width=ov.style.width=CW*k+'px';cv.style.height=ov.style.height=CH*k+'px'};
  W.onResize=fit;new ResizeObserver(fit).observe(area);
  const undo=[],redo=[];const push=()=>{undo.push(X.getImageData(0,0,CW,CH));if(undo.length>25)undo.shift();redo.length=0};
  const doUndo=()=>{if(!undo.length)return;redo.push(X.getImageData(0,0,CW,CH));X.putImageData(undo.pop(),0,0);dirty=true;upd()};
  const doRedo=()=>{if(!redo.length)return;undo.push(X.getImageData(0,0,CW,CH));X.putImageData(redo.pop(),0,0);dirty=true;upd()};
  const drawTB=()=>{tb.querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===tool));tb.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',+b.dataset.s===size));tb.querySelectorAll('[data-c]').forEach(b=>b.classList.toggle('on',b.dataset.c===color));$('.sp-cur',tb).style.background=color};
  tb.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.t)tool=b.dataset.t;if(b.dataset.s)size=+b.dataset.s;if(b.dataset.c)color=b.dataset.c;if(b.dataset.a==='undo')doUndo();if(b.dataset.a==='redo')doRedo();drawTB();snd('click')});
  $('input',tb).addEventListener('input',e=>{color=e.target.value;drawTB()});
  const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*CW/r.width,(e.clientY-r.top)*CH/r.height]};
  let down=null,last=null;
  cv.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();cv.setPointerCapture(e.pointerId);const p=pt(e);push();dirty=true;
    if(tool==='fill'){flood(Math.floor(p[0]),Math.floor(p[1]),color);upd();return}
    down=p;last=p;if(tool==='brush'||tool==='pencil'||tool==='eraser')stroke(p,p)});
  cv.addEventListener('pointermove',e=>{if(!down)return;const p=pt(e);
    if(tool==='brush'||tool==='pencil'||tool==='eraser'){stroke(last,p);last=p}else{O.clearRect(0,0,CW,CH);shape(O,down,p,e.shiftKey)}});
  const end=e=>{if(!down)return;const p=pt(e);if(['line','rect','oval'].includes(tool)){O.clearRect(0,0,CW,CH);shape(X,down,p,e.shiftKey)}down=null;upd()};
  cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
  function stroke(a,b){X.save();X.lineCap=X.lineJoin=tool==='pencil'?'square':'round';X.strokeStyle=tool==='eraser'?'#fff':color;X.lineWidth=tool==='pencil'?Math.max(1,size/3):tool==='eraser'?size*2:size;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0]+.01,b[1]);X.stroke();X.restore()}
  function shape(C,a,b,sq){C.save();C.strokeStyle=color;C.lineWidth=size;C.lineCap='round';C.lineJoin='round';let w=b[0]-a[0],hh=b[1]-a[1];if(sq&&tool!=='line'){const m=Math.max(Math.abs(w),Math.abs(hh));w=Math.sign(w||1)*m;hh=Math.sign(hh||1)*m}
    C.beginPath();if(tool==='line'){C.moveTo(a[0],a[1]);C.lineTo(b[0],b[1])}else if(tool==='rect')C.rect(a[0],a[1],w,hh);else C.ellipse(a[0]+w/2,a[1]+hh/2,Math.abs(w/2),Math.abs(hh/2),0,0,Math.PI*2);C.stroke();C.restore()}
  function flood(x,y,hex){const im=X.getImageData(0,0,CW,CH),d=im.data;const i0=(y*CW+x)*4;const t=[d[i0],d[i0+1],d[i0+2]];const c=[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];
    if(t[0]===c[0]&&t[1]===c[1]&&t[2]===c[2])return;const tol=40,m=(i)=>Math.abs(d[i]-t[0])+Math.abs(d[i+1]-t[1])+Math.abs(d[i+2]-t[2])<=tol;
    const st=[[x,y]],seen=new Uint8Array(CW*CH);while(st.length){let [px,py]=st.pop();let i=py*CW+px;while(px>=0&&!seen[i]&&m(i*4)){px--;i--}px++;i++;let up=false,dn=false;
      while(px<CW&&!seen[i]&&m(i*4)){seen[i]=1;d[i*4]=c[0];d[i*4+1]=c[1];d[i*4+2]=c[2];d[i*4+3]=255;
        if(py>0){const j=i-CW;if(!seen[j]&&m(j*4)){if(!up){st.push([px,py-1]);up=true}}else up=false}
        if(py<CH-1){const j=i+CW;if(!seen[j]&&m(j*4)){if(!dn){st.push([px,py+1]);dn=true}}else dn=false}px++;i++}}
    X.putImageData(im,0,0)}
  const upd=()=>{const n=file&&F.get(file);W.setTitle((dirty?'*':'')+(n?n.name+'.png':'Без назви')+' — Малювалка')};
  function loadPic(id){const n=F.get(id);if(!n)return;const im=new Image();im.onload=()=>{X.fillStyle='#fff';X.fillRect(0,0,CW,CH);const k=Math.min(CW/im.width,CH/im.height,1);X.drawImage(im,(CW-im.width*k)/2,(CH-im.height*k)/2,im.width*k,im.height*k);file=id;dirty=false;undo.length=redo.length=0;upd()};im.src=n.data}
  async function askSave(){if(!dirty)return true;const n=file&&F.get(file);const r=await dialog({title:'Малювалка',icon:'ask',text:'Зберегти зміни в малюнку «'+(n?n.name+'.png':'Без назви')+'»?',buttons:[{t:'Зберегти',v:'y',p:1},{t:'Не зберігати',v:'n'},{t:'Скасувати',v:null}]});if(r==='y')return await savePic();return r==='n'}
  async function newPic(){if(!await askSave())return;X.fillStyle='#fff';X.fillRect(0,0,CW,CH);file=null;dirty=false;undo.length=redo.length=0;upd()}
  async function openPic(){if(!await askSave())return;const id=await fileDialog({mode:'open',ext:'png',pid:'pics'});if(id)loadPic(id)}
  async function savePic(as){const data=cv.toDataURL('image/png');
    if(file&&!as&&F.get(file)&&!F.isIn(file,'trash')){F.write(file,data);dirty=false;upd();act({t:'save',ext:'png'});return true}
    const r=await fileDialog({mode:'save',ext:'png',name:file&&F.get(file)?F.get(file).name:'Мій малюнок',pid:file&&F.get(file)?F.get(file).parent:'pics'});if(!r)return false;
    if(r.id){F.write(r.id,data);file=r.id}else file=F.mk(r.pid,r.name,'file','png',data).id;dirty=false;upd();notify('Малюнок збережено',F.full(F.get(file)),'img');act({t:'save',ext:'png'});return true}
  W.onKey=e=>{if(!(e.ctrlKey||e.metaKey))return;const c=e.code;if(c==='KeyZ'){doUndo();return true}if(c==='KeyY'){doRedo();return true}if(c==='KeyS'){savePic(e.shiftKey);return true}if(c==='KeyO'){openPic();return true}if(c==='KeyN'){newPic();return true}};
  W.beforeClose=askSave;W.onArg=id=>askSave().then(ok=>ok&&loadPic(id));
  drawTB();upd();if(fid)loadPic(fid);setTimeout(fit,30);
  return W;
}});

/* --- Фото --- */
register({id:'photos',name:'Фото',icon:I.photo,kw:'перегляд зображень картинки',open:(fid)=>{
  const W=win({app:'photos',title:'Фото',icon:I.photo,w:760,h:540});
  W.body.innerHTML=`<div class="sx-tool"><button class="pv" title="Попереднє">${L.back}</button><button class="nx" title="Наступне">${L.fwd}</button><div style="flex:1"></div><button class="wp">${L.wall}<span>Зробити фоном</span></button><button class="ed">${L.brush}<span>Змінити</span></button><button class="op">${L.newf}<span>Відкрити</span></button></div><div class="sf-v"></div>`;
  const v=$('.sf-v',W.body);let cur=null;
  const list=()=>cur&&F.get(cur)?F.kids(F.get(cur).parent).filter(n=>n.ext==='png'):[];
  function show(id){const n=F.get(id);cur=id;if(!n){v.innerHTML='<div class="sos-empty" style="color:#cfc8de">Відкрий малюнок: «Відкрити» або подвійний клік на файлі .png</div>';W.setTitle('Фото');return}
    v.innerHTML='';const im=new Image();im.src=n.data;im.alt=n.name;v.appendChild(im);W.setTitle(n.name+'.png — Фото')}
  const step=d=>{const l=list();if(l.length<2)return;const i=l.findIndex(n=>n.id===cur);show(l[(i+d+l.length)%l.length].id)};
  $('.pv',W.body).onclick=()=>step(-1);$('.nx',W.body).onclick=()=>step(1);
  $('.ed',W.body).onclick=()=>{if(cur&&F.get(cur))openApp('paint',cur)};
  $('.wp',W.body).onclick=()=>{if(cur&&F.get(cur)){setWall('img:'+cur,1);notify('Шпалери змінено',F.full(F.get(cur)),'img')}};
  $('.op',W.body).onclick=async()=>{const id=await fileDialog({mode:'open',ext:'png',pid:cur&&F.get(cur)?F.get(cur).parent:'pics'});if(id)show(id)};
  W.onKey=e=>{if(e.key==='ArrowLeft'){step(-1);return true}if(e.key==='ArrowRight'){step(1);return true}};
  W.onArg=show;show(fid);return W;
}});

/* --- Калькулятор --- */
register({id:'calc',name:'Калькулятор',icon:I.calc,single:true,kw:'рахувати числа',open:()=>{
  const W=win({app:'calc',title:'Калькулятор',icon:I.calc,w:330,h:470,resizable:false});
  W.body.innerHTML=`<div class="sc"><div class="sc-d"><small></small><b>0</b></div><div class="sc-k">${['C','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','±','0',',','='].map(k=>`<button class="${'÷×−+'.includes(k)?'op':k==='='?'eq':''}" data-k="${k}">${k}</button>`).join('')}</div></div>`;
  const out=$('b',W.body),hist=$('small',W.body);let a=null,op=null,cur='0',fresh=true;
  const fmt=n=>{if(!isFinite(n))return 'Помилка';let s=String(+n.toPrecision(12));return s.replace('.',',')};
  const num=()=>parseFloat(cur.replace(',','.'));
  const calc=(x,y,o)=>o==='+'?x+y:o==='−'?x-y:o==='×'?x*y:o==='÷'?(y===0?NaN:x/y):y;
  const show=()=>{out.textContent=cur;out.style.fontSize=cur.length>12?'22px':'';hist.textContent=a!==null&&op?fmt(a)+' '+op:''};
  function key(k){snd('click');
    if(/\d/.test(k)){if(fresh||cur==='0'){cur=k;fresh=false}else if(cur.length<15)cur+=k}
    else if(k===','){if(fresh){cur='0,';fresh=false}else if(!cur.includes(','))cur+=','}
    else if(k==='C'){a=null;op=null;cur='0';fresh=true}
    else if(k==='⌫'){if(!fresh){cur=cur.length>1?cur.slice(0,-1):'0'}}
    else if(k==='±'){if(cur!=='0')cur=cur[0]==='-'?cur.slice(1):'-'+cur}
    else if(k==='%'){cur=fmt(a!==null?a*num()/100:num()/100);fresh=true}
    else if('÷×−+'.includes(k)){if(a!==null&&op&&!fresh){a=calc(a,num(),op);cur=fmt(a)}else a=num();op=k;fresh=true}
    else if(k==='='){if(a!==null&&op){const r=calc(a,num(),op);act({t:'calc',r,a,b:num(),op});hist.textContent=fmt(a)+' '+op+' '+cur+' =';cur=fmt(r);a=null;op=null;fresh=true;out.textContent=cur;return}}
    show()}
  W.body.addEventListener('click',e=>{const b=e.target.closest('[data-k]');b&&key(b.dataset.k)});
  W.onKey=e=>{const m={'/':'÷','*':'×','-':'−','+':'+',Enter:'=','=':'=',Backspace:'⌫',Escape:'C',Delete:'C',',':',','.':',','%':'%'};const k=/^\d$/.test(e.key)?e.key:m[e.key];if(k){key(k);return true}};
  return W;
}});

/* --- Календар --- */
register({id:'calendar',name:'Календар',icon:I.cal,single:true,kw:'дата місяць',open:()=>{
  const W=win({app:'calendar',title:'Календар',icon:I.cal,w:420,h:500,resizable:false});
  const d=new Date();const wrap=h(`<div style="padding:18px 20px;flex:1;overflow:auto"><div class="sos-bigtime">${pad(d.getHours())}:${pad(d.getMinutes())}</div><div class="sos-bigdate">${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_G[d.getMonth()]} ${d.getFullYear()}</div></div>`);
  const c=calendarEl();wrap.appendChild(c);const tb=h('<button class="sos-btn" style="margin-top:12px">Сьогодні</button>');tb.onclick=()=>c.today();wrap.appendChild(tb);
  W.body.appendChild(wrap);const t=setInterval(()=>{const n=new Date();$('.sos-bigtime',wrap).textContent=pad(n.getHours())+':'+pad(n.getMinutes())},5000);W.onClose=()=>clearInterval(t);return W;
}});

/* --- Налаштування --- */
register({id:'settings',name:'Налаштування',icon:I.settings,single:true,kw:'шпалери звук мова скинути',open:(sec)=>{
  const W=win({app:'settings',title:'Налаштування',icon:I.settings,w:780,h:520});
  const EX=opt.settingsSections||[];const SEC=[...EX.map(x=>[x[0],x[1],x[2]]),['wall','Шпалери',L.wall],['sound','Звук і мова',L.snd],['disk','Пам\'ять',L.disk],['reset','Скинути',L.reload],['about','Про систему',L.about]];
  W.body.innerHTML=`<div class="ss"><div class="ss-nav">${SEC.map(([id,n,ic])=>`<button data-s="${id}">${ic}<span>${n}</span></button>`).join('')}</div><div class="ss-body"></div></div>`;
  const body=$('.ss-body',W.body);let cur='wall';
  function draw(s){cur=s||cur;W.body.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===cur));
    const ex=EX.find(x=>x[0]===cur);if(ex){ex[3](body);return}
    if(cur==='wall'){const own=String(S.wall).startsWith('img:')?`<button data-w="${esc(S.wall)}" class="on" style="background:${esc(wallCss())}" title="Твоє фото" aria-label="Твоє фото"></button>`:'';
      body.innerHTML='<h2>Шпалери</h2><div class="ss-walls">'+own+WALLS.map(w=>`<button data-w="${w.id}" class="${S.wall===w.id?'on':''}" style="background:${w.css}" title="${esc(w.n)}" aria-label="${esc(w.n)}"></button>`).join('')+'</div><p style="font-weight:700;color:#6f6787;margin-top:14px">Своє фото: права кнопка на малюнку → «Зробити фоном робочого столу».</p>'}
    else if(cur==='sound'){body.innerHTML=`<h2>Звук і мова</h2><div class="ss-row"><div>Звуки системи<small>Клацання, відкриття вікон, кошик</small></div><button class="ss-sw${S.snd?' on':''}" data-x="snd" aria-label="Звук"></button></div>
      <div class="ss-row"><div>Мова вводу<small>Перемикай клавішами Alt+Shift або кнопкою на панелі задач</small></div><div class="ss-seg"><button data-l="ua" class="${S.lang==='ua'?'on':''}">UA</button><button data-l="en" class="${S.lang==='en'?'on':''}">EN</button></div></div>`}
    else if(cur==='disk'){const u=OS.usage(),files=Object.values(S.nodes).filter(n=>n.type==='file'&&n.parent!=='trash').length;
      body.innerHTML=`<h2>Пам'ять</h2><div class="ss-row"><div>Локальний диск (C:)<div class="ss-meter"><i style="width:${Math.min(100,u/CAP*100).toFixed(1)}%"></i></div><small>Зайнято ${fmtSize(u)} з ${fmtSize(CAP)} · ${plural(files,'файл','файли','файлів')} · у кошику ${F.kids('trash').length}</small></div></div>
      <div class="ss-row"><div>Очистити кошик<small>Звільнить місце, яке займають видалені файли</small></div><button class="sos-btn" data-x="empty">Очистити</button></div>`}
    else if(cur==='reset'){body.innerHTML=`<h2>Скинути комп'ютер</h2><p style="font-weight:700;color:#6f6787;line-height:1.5">Усі твої папки, файли й малюнки буде видалено, а шпалери й налаштування повернуться до початкових. Так комп'ютер стане як новий.</p><button class="sos-btn d" data-x="reset">Скинути все</button>`}
    else body.innerHTML=`<h2>Про систему</h2><div style="display:flex;gap:16px;align-items:center"><div style="width:70px;flex:none">${I.logo}</div><div style="font-weight:700;line-height:1.5">${esc(opt.title)} ${VER}<br><span style="color:#6f6787">${esc(opt.about||'Безпечний комп\'ютер для навчання. Тут можна все — нічого не зламається.')}</span></div></div>
      <h2 style="margin-top:22px;font-size:18px">Що спробувати</h2><div style="font-weight:600;line-height:1.7;color:#3b3450">Створити папку: права кнопка на робочому столі → «Створити».<br>Перейменувати: <b>F2</b>. Видалити: <b>Delete</b>. Повернути: «Кошик» → «Відновити».<br>Копіювати й вставити: <b>Ctrl+C</b>, <b>Ctrl+V</b>. Зберегти: <b>Ctrl+S</b>.<br>Змінити мову: <b>Alt+Shift</b>. Відкрити «Пуск»: <b>Ctrl+Esc</b>.<br>На планшеті: дотик — виділити, два дотики — відкрити, довгий дотик — меню.</div>
      <a href="https://github.com/whyuxavier/it-maysternia" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:10px 14px;border-radius:12px;background:#f6e19c;color:#3b3450;font-weight:800;text-decoration:none"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6L2.5 9.3l6.6-.8z"/></svg>Проєкт на GitHub</a>`}
  W.body.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.s)draw(b.dataset.s);else if(b.dataset.w){setWall(b.dataset.w,1);draw()}else if(b.dataset.l){setLang(b.dataset.l,1);draw()}
    else if(b.dataset.x==='snd'){S.snd=!S.snd;drawSnd();save();draw()}else if(b.dataset.x==='empty'){await emptyBin();draw()}
    else if(b.dataset.x==='reset'){const ok=await OS.confirm('Скинути комп\'ютер','Точно видалити всі файли й повернути комп\'ютер до початкового стану?','Так, скинути','Ні','warn');if(ok)OS.reset()}});
  OS.on('settings',()=>W.el.isConnected&&draw());OS.on('fs',()=>W.el.isConnected&&cur==='disk'&&draw());
  W.onArg=s=>draw(s);draw(typeof sec==='string'?sec:(EX[0]?EX[0][0]:'wall'));return W;
}});

/* --- Браузер --- */
const WX=['☀','⛅','☁','🌧'];
function wxIcon(k){return ['<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="9" fill="#f3cf6b"/><g stroke="#f3cf6b" stroke-width="3" stroke-linecap="round"><path d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l3.5 3.5M33.5 33.5L37 37M11 37l3.5-3.5M33.5 14.5L37 11"/></g></svg>',
 '<svg viewBox="0 0 48 48"><circle cx="18" cy="18" r="8" fill="#f3cf6b"/><path d="M14 38h22a7 7 0 0 0 0-14 10 10 0 0 0-19 3 6 6 0 0 0-3 11z" fill="#fff" stroke="#9fb3cc" stroke-width="2"/></svg>',
 '<svg viewBox="0 0 48 48"><path d="M10 34h26a8 8 0 0 0 0-16 11 11 0 0 0-21 3 7 7 0 0 0-5 13z" fill="#dfe6f0" stroke="#9fb3cc" stroke-width="2"/></svg>',
 '<svg viewBox="0 0 48 48"><path d="M10 28h26a8 8 0 0 0 0-16 11 11 0 0 0-21 3 7 7 0 0 0-5 13z" fill="#dfe6f0" stroke="#9fb3cc" stroke-width="2"/><path d="M16 33l-2 6M24 33l-2 6M32 33l-2 6" stroke="#4f8fd6" stroke-width="3" stroke-linecap="round"/></svg>'][k]}
const ART={
 komp:{t:'Комп\'ютер',kw:'комп\'ютер пк системний блок монітор',b:'<p class="lead">Комп\'ютер — це машина, яка опрацьовує інформацію: рахує, зберігає, показує й передає.</p><h2>З чого він складається</h2><p><b>Монітор</b> показує зображення. <b>Системний блок</b> або корпус ноутбука — це «мозок», де працює процесор і зберігаються файли. <b>Клавіатура</b> й <b>мишка</b> допомагають давати комп\'ютеру команди.</p><h2>Файли й папки</h2><p>Усе, що ти створюєш, зберігається у <b>файлах</b>. Щоб не загубитися, файли складають у <b>папки</b> — як зошити в портфель.</p><p>Далі: <span data-go="vikidity.ua/myshka">Мишка</span> · <span data-go="vikidity.ua/klaviatura">Клавіатура</span></p>'},
 myshka:{t:'Комп\'ютерна мишка',kw:'мишка миша клік подвійний клік права кнопка',b:'<p class="lead">Мишка керує вказівником на екрані.</p><h2>Які бувають кліки</h2><p><b>Клік</b> — один раз натиснути ліву кнопку: виділити. <b>Подвійний клік</b> — двічі швидко: відкрити. <b>Права кнопка</b> — показати меню з діями. <b>Перетягування</b> — натиснути, тримати й вести.</p><p>Потренуйся в <span data-app="pctrainer">Фіфіклік</span>.</p>'},
 klaviatura:{t:'Клавіатура',kw:'клавіатура клавіші мова shift alt пробіл enter',b:'<p class="lead">Клавіатура — це пристрій для введення тексту й команд.</p><h2>Важливі клавіші</h2><p><b>Enter</b> — новий рядок або «так». <b>Backspace</b> — стерти букву ліворуч. <b>Shift</b> — велика буква. <b>Пробіл</b> — проміжок між словами. <b>Alt + Shift</b> — змінити мову (UA ↔ EN).</p><h2>Корисні поєднання</h2><p><b>Ctrl + C</b> — копіювати, <b>Ctrl + V</b> — вставити, <b>Ctrl + Z</b> — скасувати, <b>Ctrl + S</b> — зберегти.</p>'},
 internet:{t:'Інтернет',kw:'інтернет сайт браузер адреса посилання',b:'<p class="lead">Інтернет — це мільйони комп\'ютерів, з\'єднаних між собою.</p><h2>Браузер і сайти</h2><p><b>Браузер</b> — програма, щоб відкривати сайти. У рядку адреси пишуть адресу сайту, наприклад <span data-go="pogoda.ua">pogoda.ua</span>. Підкреслені слова — це <b>посилання</b>: натиснеш — перейдеш на іншу сторінку.</p><p>Далі: <span data-go="vikidity.ua/bezpeka">Безпека в інтернеті</span></p>'},
 bezpeka:{t:'Безпека в інтернеті',kw:'безпека пароль шахраї фішинг',b:'<p class="lead">П\'ять правил безпечного інтернету.</p><p>1. Нікому не кажи свій пароль — навіть «адміністратору гри».<br>2. Не відкривай дивні посилання від незнайомців.<br>3. Не пиши свою адресу й номер телефону.<br>4. Якщо щось налякало — скажи дорослим.<br>5. Перевіряй новини в кількох джерелах.</p><p>Потренуйся: <span data-app="phishing">Фішинг-детектор</span>.</p>'},
};
const RIDDLES='Загадки про комп\'ютер\n\n1. Має хвостик, а не звір, по столу бігає — повір. (Мишка)\n2. Стоять кнопки рядками, ти друкуєш їх пальцями. (Клавіатура)\n3. Що за телевізор — показує все, що я роблю на комп\'ютері? (Монітор)\n4. Куди складають файли, щоб не загубились? (У папку)\n5. Куди потрапляють видалені файли? (У кошик)';
function wallPng(css,n){const c=document.createElement('canvas');c.width=640;c.height=400;const x=c.getContext('2d');const G=[['#58a6f3','#7d88ee','#b48cf0'],['#3b2f7e','#6b4fd8','#f0a56e'],['#a9cfee','#6fb38f','#e07a6a'],['#9fdcc0','#5aa8a0','#3f7f9a'],['#f9d3b4','#eba497','#c98bc4'],['#1f2547','#3b3a7a','#5b4a8a']][n];
  const g=x.createLinearGradient(0,0,640,400);g.addColorStop(0,G[0]);g.addColorStop(.6,G[1]);g.addColorStop(1,G[2]);x.fillStyle=g;x.fillRect(0,0,640,400);
  x.fillStyle='rgba(255,255,255,.25)';x.beginPath();x.arc(500,90,70,0,7);x.fill();x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.ellipse(200,420,320,110,0,0,7);x.fill();return c.toDataURL('image/png')}
register({id:'browser',name:'Браузер',icon:I.web,kw:'інтернет сайт пошук',open:(url)=>{
  const W=win({app:'browser',title:'Браузер',icon:I.web,w:960,h:620});
  W.body.innerHTML=`<div class="sb-bar"><button class="b" title="Назад">${L.back}</button><button class="f" title="Вперед">${L.fwd}</button><button class="r" title="Оновити (F5)">${L.reload}</button><button class="hm" title="Домашня сторінка">${L.home}</button><input class="sb-url" spellcheck="false" aria-label="Адреса сайту"></div><div class="sb-page"><div class="sb-load"></div><div class="sb-in"></div></div>`;
  const page=$('.sb-in',W.body),urlI=$('.sb-url',W.body),ld=$('.sb-load',W.body),pg=$('.sb-page',W.body);let hist=[],hi=-1;
  const SITES={
   'shukayko.ua':()=>({t:'Шукайко',h:`<div class="sb-logo"><span>Шу</span><span>кай</span><span>ко</span><span>!</span></div><form class="sb-sform"><input name="q" placeholder="Що шукаємо?" aria-label="Пошук"><button>Знайти</button></form>
     <div class="sb-tiles">${[['vikidity.ua','Вікі-дитя',I.notepad],['pogoda.ua','Погода',I.photo],['shpalery.ua','Шпалери',I.img],['zagadky.ua','Загадки',I.txt],['vikidity.ua/bezpeka','Безпека',I.info]].map(([u,n,ic])=>`<button data-go="${u}"><i>${ic}</i>${n}</button>`).join('')}</div>`}),
   'vikidity.ua':()=>({t:'Вікі-дитя',h:`<h1>Вікі-дитя</h1><p class="lead">Енциклопедія для допитливих. Обери статтю:</p>${Object.entries(ART).map(([k,a])=>`<p>• <span data-go="vikidity.ua/${k}">${a.t}</span></p>`).join('')}`}),
   'pogoda.ua':()=>{const d=new Date();let s=d.getFullYear()*372+d.getMonth()*31+d.getDate();const rnd=()=>{s=(s*9301+49297)%233280;return s/233280};const m=d.getMonth(),base=[-2,0,5,11,17,21,23,22,17,10,4,0][m];
     return{t:'Погода',h:`<h1>Погода в Борисполі</h1><p class="lead">Прогноз на тиждень</p><div class="sb-wx">${Array.from({length:7},(_,i)=>{const dd=new Date(d);dd.setDate(d.getDate()+i);const k=Math.floor(rnd()*4);const t=Math.round(base+rnd()*6-3);return`<div>${['Нд','Пн','Вт','Ср','Чт','Пт','Сб'][dd.getDay()]}<br>${dd.getDate()}${wxIcon(k)}${t>0?'+':''}${t}°</div>`}).join('')}</div>`}},
   'shpalery.ua':()=>({t:'Шпалери',h:`<h1>Безкоштовні шпалери</h1><p class="lead">Натисни «Завантажити» — малюнок з'явиться в папці «Завантаження».</p>${WALLS.map((w,i)=>`<div class="sb-card"><div class="pv" style="background:${w.css}"></div><div><b>${esc(w.n)}</b><p>640×400, PNG</p></div><button data-dl="${i}">Завантажити</button></div>`).join('')}`}),
   'zagadky.ua':()=>({t:'Загадки',h:`<h1>Загадки про комп'ютер</h1><p style="white-space:pre-line">${esc(RIDDLES.split('\n\n')[1])}</p><div class="sb-card"><div class="pv" style="display:grid;place-items:center;background:#fff">${I.txt}</div><div><b>Загадки.txt</b><p>Текстовий файл</p></div><button data-dl="txt">Завантажити</button></div>`}),
  };
  Object.keys(ART).forEach(k=>SITES['vikidity.ua/'+k]=()=>({t:ART[k].t+' — Вікі-дитя',h:`<p><span data-go="vikidity.ua">← Вікі-дитя</span></p><h1>${ART[k].t}</h1>${ART[k].b}`}));
  Object.assign(SITES,opt.sites||{});
  function norm(u){u=(u||'').trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/$/,'');return u}
  function search(q){const s=q.toLowerCase();const res=[];
    Object.entries(ART).forEach(([k,a])=>{if((a.t+' '+a.kw).toLowerCase().split(/\s+/).some(w=>w.length>2&&(s.includes(w)||w.includes(s))))res.push(['vikidity.ua/'+k,a.t+' — Вікі-дитя',a.b.replace(/<[^>]+>/g,' ').slice(0,140)+'…'])});
    if(/погод|дощ|сонц|температ/.test(s))res.push(['pogoda.ua','Погода в Борисполі','Прогноз погоди на тиждень.']);
    if(/шпалер|малюн|картин|фон/.test(s))res.push(['shpalery.ua','Безкоштовні шпалери','Завантаж гарні шпалери для робочого столу.']);
    if(/загад/.test(s))res.push(['zagadky.ua','Загадки про комп\'ютер','Відгадай загадки й завантаж файл.']);
    (opt.searchMore||(()=>[]))(s).forEach(r=>res.push(r));
    return{t:q+' — Шукайко',h:`<form class="sb-sform" style="margin:0 0 20px"><input name="q" value="${esc(q)}" aria-label="Пошук"><button>Знайти</button></form>`+(res.length?res.map(r=>`<div class="sb-res"><small>${esc(r[0])}</small><span data-go="${esc(r[0])}">${esc(r[1])}</span><p>${esc(r[2])}</p></div>`).join(''):`<p class="lead">За запитом «${esc(q)}» нічого не знайдено. Спробуй інші слова: «мишка», «погода», «шпалери».</p>`)}}
  function nav(u,nohist){u=norm(u)||'shukayko.ua';let r;
    if(u.startsWith('?'))r=search(decodeURIComponent(u.slice(1)));
    else if(SITES[u])r=SITES[u]();
    else if(!u.includes('.')&&!u.includes('/')){u='?'+u;r=search(u.slice(1))}
    else r={t:'Сайт не знайдено',h:`<div class="sb-404">${I.web}<h1>Не вдається знайти сайт</h1><p>Перевір, чи правильно написано адресу <b>${esc(u)}</b>.</p><p><span data-go="shukayko.ua">Повернутися до пошуку</span></p></div>`};
    if(!nohist){hist=hist.slice(0,hi+1);hist.push(u);hi=hist.length-1}
    ld.style.transition='none';ld.style.width='0';ld.offsetWidth;ld.style.transition='';ld.style.width='70%';
    setTimeout(()=>{page.innerHTML=r.h;pg.scrollTop=0;urlI.value=u.startsWith('?')?'shukayko.ua/?q='+decodeURIComponent(u.slice(1)):u;W.setTitle(r.t+' — Браузер');ld.style.width='100%';setTimeout(()=>{ld.style.transition='none';ld.style.width='0'},250);
      $('.b',W.body).disabled=hi<=0;$('.f',W.body).disabled=hi>=hist.length-1;const f=page.querySelector('form');if(f)f.onsubmit=e=>{e.preventDefault();const q=f.q.value.trim();if(q)nav('?'+encodeURIComponent(q))}},220);
  }
  page.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){nav(g.dataset.go);return}const a=e.target.closest('[data-app]');if(a){openApp(OS.apps[a.dataset.app]?a.dataset.app:'browser');return}
    const d=e.target.closest('[data-dl]');if(d){let n;if(d.dataset.dl==='txt')n=F.mk('down','Загадки','file','txt',RIDDLES);else{const i=+d.dataset.dl;n=F.mk('down','Шпалери '+WALLS[i].n,'file','png',wallPng(WALLS[i].css,i))}
      d.textContent='Завантажено ✓';snd('note');notify('Завантаження завершено',F.full(n),'down',{t:'Відкрити папку',f:()=>openApp('explorer','down')})}});
  urlI.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const v=urlI.value.trim();const m=v.match(/shukayko\.ua\/\?q=(.*)/i);nav(m?'?'+encodeURIComponent(m[1]):v);urlI.blur()}});
  urlI.addEventListener('focus',()=>setTimeout(()=>urlI.select(),0));
  $('.b',W.body).onclick=()=>{if(hi>0){hi--;nav(hist[hi],1)}};$('.f',W.body).onclick=()=>{if(hi<hist.length-1){hi++;nav(hist[hi],1)}};
  $('.r',W.body).onclick=()=>nav(hist[hi],1);$('.hm',W.body).onclick=()=>nav('shukayko.ua');
  W.onKey=e=>{if(e.key==='F5'){nav(hist[hi],1);return true}if(e.altKey&&e.key==='ArrowLeft'){$('.b',W.body).click();return true}};
  W.onArg=u=>nav(u);nav(url||'shukayko.ua');
  return W;
}});

/* --- програми ІТ-Майстерні --- */
if(opt.catalog){const B=opt.base;
 [['pctrainer','Фіфіклік','trainer','mouse','pc-trainer/','мишка тренажер',1],['firstpc','ФіфіПК','trainer','firstpc','my-first-pc/','windows вправи',1],['keypuzzle','Клавіатурний пазл','trainer','keys','key-puzzle/','клавіатура',1],
  ['sorting','Сортувальня','trainer','sort','sortuvalnia/','сортування лічба',2],['academy','Keyboard Academy','trainer','keys','keyboard-academy/','друк клавіатура',5],['robot','Робот-кур\'єр','trainer','robot','robot-courier/','алгоритми',5],
  ['phishing','Фішинг-детектор','trainer','warn','phishing-detector/','безпека',5],
  ['racer','MOUSE RACER','game','car','mouse-racer/','гонки',1],['tangram','Танграм','game','tangram','tangram/','',1],['circle','Намалюй коло','game','circle','draw-circle/','',1],['blocks','Block Puzzle','game','blocks','block-puzzle/','майнкрафт',1],
  ['mines','Сапер','game','mines','minesweeper/','',5],['wordshaker','WordShaker','game','words','wordshaker/','слова',5],['photopuzzle','Пазл з фото','game','photopz','photo-puzzle/','',1],
  ['pixelka','Пікселька','tool','pixel','pixelka/','піксель малювати',1],['flowchart','Блок-схеми','tool','flow','flowchart/','алгоритм',5]
 ].filter(a=>a[6]<=(opt.maxGrade||12)&&(!opt.catalogCats||opt.catalogCats.includes(a[2]))).forEach(([id,name,cat,ic,path,kw])=>register({id,name,cat,icon:I[ic],url:B+path,kw:kw||''}));}
(opt.apps||[]).forEach(register);

/* =====================================================================
   СТАРТ
   ===================================================================== */
S=load()||defaults();
/* ярлики, що з'явилися в новій версії: додаємо один раз (якщо учень видалить — не повертаємо) */
(opt.deskAdd||[]).forEach(a=>{S.ens=S.ens||{};if(S.ens[a]||!OS.apps[a])return;S.ens[a]=1;
  if(Object.values(S.nodes).some(n=>n.parent==='desk'&&n.ext==='lnk'&&n.data===a))return;
  const id='n'+(S.seq++),now=Date.now();S.nodes[id]={id,name:OS.apps[a].name,type:'file',ext:'lnk',data:a,parent:'desk',ct:now,mt:now};
  if(!Object.values(S.pos||{}).some(p=>p[0]===0&&p[1]===2))(S.pos=S.pos||{})[id]=[0,2];save()});
const desktopView=View(iconsEl,'desk','desk',null);iconsEl.dataset.drop='desk';
OS.desktop=desktopView;
setWall(S.wall);setLang(S.lang);drawSnd();
desktopView.render();focusView(desktopView);
new ResizeObserver(()=>desktopView.render()).observe(iconsEl);
iconsEl.addEventListener('pointerdown',()=>{if(active){active=null;OS.wins.forEach(x=>x.el.classList.add('inactive'));drawTasks()}},true);
addEventListener('beforeunload',saveNow);
addEventListener('storage',e=>{if(e.key===opt.key&&e.newValue){const s=load();if(s){S=s;emit('fs')}}});
/* =====================================================================
   ФІФІ — помічниця, що живе біля годинника (opt.fifi)
   ===================================================================== */
if(opt.fifi){
  const FCSS=`
.sos-fifib{padding:0 4px!important;width:46px}.sos-fifib svg{width:34px!important;height:36px!important;transition:transform .2s}.sos-fifib:hover svg{transform:translateY(-3px) rotate(-6deg)}
.sos-fifib.on svg{animation:ffHop .6s ease 2}
@keyframes ffHop{50%{transform:translateY(-6px)}}
.sos-ff{position:absolute;right:10px;bottom:60px;z-index:9450;display:flex;align-items:flex-end;gap:6px;max-width:calc(100% - 20px);pointer-events:none;animation:sosUp .25s ease-out}
.sos-ff .bub{pointer-events:auto;background:#fff;border-radius:18px 18px 4px 18px;box-shadow:0 14px 40px rgba(20,25,60,.35);padding:14px 16px;width:330px;max-width:100%;font-weight:700;font-size:15.5px;line-height:1.45;color:#3b3450}
.sos-ff .bub b.t{display:block;font:800 13px Rubik,Nunito,sans-serif;color:#8a7cf0;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.sos-ff .bub .how{margin-top:8px;padding:8px 10px;border-radius:10px;background:#f4f1fb;font-size:14px;color:#5b5378}
.sos-ff .bub .row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
.sos-ff .cat{width:86px;flex:none;pointer-events:auto;cursor:pointer;filter:drop-shadow(0 6px 10px rgba(20,25,60,.3));animation:ffBounce .5s ease}
@keyframes ffBounce{0%{transform:translateY(30px);opacity:0}60%{transform:translateY(-6px)}100%{transform:none;opacity:1}}
.sos-ff.yay .cat{animation:ffYay .7s ease}
@keyframes ffYay{30%{transform:translateY(-14px) rotate(-8deg)}60%{transform:translateY(0) rotate(6deg)}}
.ff-hd{display:flex;gap:12px;align-items:center;margin-bottom:8px}.ff-hd i{width:60px;flex:none}.ff-hd b{font:800 18px Rubik,Nunito,sans-serif;display:block}.ff-hd small{font-weight:700;color:#6f6787}
.ff-bar{height:10px;border-radius:5px;background:#ece6f3;overflow:hidden;margin:4px 0 6px}.ff-bar i{display:block;height:100%;background:linear-gradient(90deg,#f6dc8a,#e8b04a)}
.ff-list{max-height:min(380px,50vh);overflow:auto;margin:0 -6px;padding:0 6px}
.ff-list h4{margin:12px 2px 4px;font:800 13px Rubik,Nunito,sans-serif;color:#6f6787;text-transform:uppercase;letter-spacing:.04em}
.ff-row{display:flex!important;align-items:center;gap:10px;width:100%;padding:8px 10px!important;border-radius:10px;text-align:left;font-weight:700!important;font-size:14.5px!important}
.ff-row:hover{background:#eef3fb}.ff-row svg{width:22px;height:22px;flex:none}.ff-row.done{color:#6f6787}
.ff-foot{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.sos-ff.tour{z-index:99995}
.ff-spot{position:fixed;z-index:99980;pointer-events:none;border-radius:12px;box-shadow:0 0 0 4px #f2c55a,0 0 0 9999px rgba(20,25,60,.42)}
.ff-spot b{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;background:#f2c55a;color:#3b3450;font:800 15px Rubik,Nunito,sans-serif;padding:5px 12px;border-radius:10px;box-shadow:0 4px 12px rgba(20,25,60,.3)}
.ff-spot.up b{bottom:calc(100% + 10px)}.ff-spot.dn b{top:calc(100% + 10px)}
.ff-spot.ok{box-shadow:0 0 0 4px #7ccf9b,0 0 0 9999px rgba(20,25,60,.42)}.ff-spot.ok b{background:#7ccf9b}
.ff-spot.lite{box-shadow:0 0 0 4px #f2c55a;animation:ffPulse .9s ease 2}
@keyframes ffPulse{50%{box-shadow:0 0 0 10px rgba(242,197,90,.5)}}
.ff-hit{position:fixed;z-index:99990;pointer-events:none;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:4px solid #e0574a;animation:ffHit .5s ease forwards}
.ff-hit.ok{border-color:#4fb57a}
@keyframes ffHit{from{transform:scale(.4);opacity:1}to{transform:scale(1.5);opacity:0}}
.ff-dots{display:flex;gap:5px;margin-top:10px}.ff-dots i{width:9px;height:9px;border-radius:50%;background:#e4def0}.ff-dots i.on{background:#e8b04a}
@media (max-width:700px){.sos-ff .cat{width:64px}.sos-ff .bub{width:auto}}
`;
  const st=document.createElement('style');st.textContent=FCSS;document.head.appendChild(st);
  if(!S.fifi)S.fifi={done:{},offered:0,off:{}};
  const FS=()=>S.fifi||(S.fifi={done:{},offered:1,off:{}});
  const SECS=[['parts','Частини системи'],['mouse','Мишка й вікна'],['files','Файли й папки'],['apps','Програми'],['keys','Клавіатура']];
  const T=[
   ['tour','parts','Екскурсія комп\'ютером','Я покажу й назву всі головні частини системи: панель задач, «Пуск», вікно, кнопки й меню.','Читай підказки й натискай «Далі».',e=>e.t==='tour',()=>tour()],
   ['find','parts','Знайди частини системи','Я називаю частину — ти знаходиш її на екрані й натискаєш.','Помилишся — я скажу, що це було, і покажу правильне місце.',e=>e.t==='partsquiz',()=>quiz()],
   ['pc','mouse','Відкрий «Мій комп\'ютер»','Двічі швидко натисни на значок «Мій комп\'ютер» на робочому столі.','Подвійний клік — це два швидкі натискання лівою кнопкою мишки, не рухаючи її.',e=>e.t==='open'&&(e.app==='explorer'||e.app==='pc')],
   ['sel','mouse','Виділи значок','Натисни один раз на будь-який значок на робочому столі — він підсвітиться.','Один клік лівою кнопкою виділяє. Відкриває — подвійний.',e=>e.t==='select'&&e.desk],
   ['ctx','mouse','Відкрий меню правою кнопкою','Натисни правою кнопкою мишки на порожньому місці робочого столу.','Права кнопка показує меню з діями. Щоб закрити меню, натисни будь-де.',e=>e.t==='ctx'],
   ['drag','mouse','Перетягни значок','Натисни на значок, тримай кнопку й перетягни його в інше місце робочого столу.','Натисни → тримай → веди мишку → відпусти.',e=>e.t==='arrange'],
   ['min','mouse','Згорни вікно','Відкрий будь-яку програму й натисни в її віконці кнопку «—» вгорі праворуч.','Згорнуте вікно не зникає: його значок лишається на панелі задач унизу.',e=>e.t==='min'],
   ['max','mouse','Розгорни вікно','Натисни кнопку «☐» у вікні — воно стане на весь екран.','Ще можна двічі натиснути на заголовок вікна.',e=>e.t==='max'&&e.on],
   ['close','mouse','Закрий вікно','Натисни хрестик «✕» у вікні вгорі праворуч.','Хрестик закриває програму.',e=>e.t==='close'],
   ['mkdir','files','Створи папку','Натисни правою кнопкою на робочому столі → «Створити» → «Папку». Напиши назву й натисни Enter.','Папка — як шухляда: у ній зберігають файли.',e=>e.t==='mk'&&e.type==='dir'],
   ['ren','files','Перейменуй папку','Натисни правою кнопкою на папку → «Перейменувати». Напиши нову назву й натисни Enter.','Назва не може бути порожньою і не може мати знаків \\ / : * ? " < > |',e=>e.t==='rename'],
   ['move','files','Поклади файл у папку','Перетягни файл «Привіт» на будь-яку папку й відпусти.','Коли папка підсвітиться жовтим — відпускай.',e=>e.t==='move'],
   ['del','files','Видали файл','Перетягни будь-який файл на «Кошик» або натисни на нього правою кнопкою → «Видалити».','Видалене не зникає одразу — воно лежить у кошику.',e=>e.t==='del'],
   ['rest','files','Поверни файл із кошика','Двічі натисни на «Кошик», потім правою кнопкою на файл → «Відновити».','Файл повернеться туди, звідки його видалили.',e=>e.t==='restore'],
   ['copy','files','Скопіюй і встав файл','Права кнопка на файлі → «Копіювати». Потім права кнопка на порожньому місці → «Вставити».','Копія — це другий такий самий файл.',e=>e.t==='paste'&&e.mode==='copy'],
   ['start','apps','Відкрий програму через «Пуск»','Натисни кнопку «Пуск» ліворуч унизу й обери будь-яку програму.','У «Пуск» можна шукати програми: просто почни писати назву.',e=>e.t==='startopen'],
   ['note','apps','Напиши й збережи текст','Відкрий Блокнот, напиши своє ім\'я й натисни «Файл» → «Зберегти».','Збережений файл з\'явиться в папці, яку ти обереш.',e=>e.t==='save'&&e.ext==='txt'&&e.len>0],
   ['paint','apps','Намалюй і збережи малюнок','Відкрий Малювалку, намалюй щось і натисни «Файл» → «Зберегти».','Малюнки зазвичай зберігають у папку «Малюнки».',e=>e.t==='save'&&e.ext==='png'],
   ['calc','apps','Порахуй 7 + 5','Відкрий Калькулятор і порахуй 7 + 5. Натисни «=».','Натискай: 7, потім +, потім 5 і =.',e=>e.t==='calc'&&e.a===7&&e.b===5&&e.op==='+'],
   ['wall','apps','Зміни шпалери','Права кнопка на робочому столі → «Змінити шпалери», або права кнопка на малюнку → «Зробити фоном робочого столу».','Шпалери — це картинка на робочому столі.',e=>e.t==='wall'],
   ['lang','keys','Зміни мову','Натисни разом клавіші Alt і Shift — мова біля годинника зміниться (UA ↔ EN).','Або просто натисни на «UA» на панелі задач.',e=>e.t==='lang'],
   ['f2','keys','Перейменуй клавішею F2','Виділи файл одним кліком і натисни клавішу F2. Напиши назву й натисни Enter.','F2 — у верхньому ряду клавіатури.',e=>e.t==='rename'&&e.via==='key'],
   ['ctrlc','keys','Копіюй клавішами','Виділи файл, натисни Ctrl + C, потім клікни на порожньому місці й натисни Ctrl + V.','Тримай Ctrl і натисни C (копіювати), потім V (вставити).',e=>e.t==='paste'&&e.via==='key'],
   ['delk','keys','Видали клавішею Delete','Виділи файл і натисни клавішу Delete.','Delete (Del) видаляє виділене в кошик.',e=>e.t==='del'&&e.via==='key'],
  ];
  const on=t=>!FS().off[t[1]];
  const list=()=>T.filter(on);
  const doneN=()=>list().filter(t=>FS().done[t[0]]).length;
  const STAR=d=>`<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${d?'#f2c55a':'none'}" stroke="${d?'#d9a53a':'#c4bdd3'}" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  /* кнопка біля годинника */
  const fb=h(`<button class="sos-fifib" title="Фіфі — завдання" aria-label="Фіфі — завдання">${I.fifi(false)}</button>`);
  $('.sos-tray',root).insertBefore(fb,langB);
  let cur=null,bub=null;
  function hide(){if(bub){bub.remove();bub=null}}
  function say(title,text,btns,how,yay){
    hide();closePop();
    bub=h(`<div class="sos-ff${yay?' yay':''}" role="status"><div class="bub">${title?`<b class="t">${esc(title)}</b>`:''}<div>${text}</div>${how?`<div class="how" hidden>${esc(how)}</div>`:''}<div class="row"></div></div><div class="cat">${I.fifi(!!yay)}</div></div>`);
    const row=$('.row',bub);
    (btns||[]).forEach(b=>{const el=h(`<button class="sos-btn${b.p?' p':''}">${esc(b.t)}</button>`);el.onclick=()=>b.f(el);row.appendChild(el)});
    $('.cat',bub).onclick=()=>{hide();openPanel()};
    root.appendChild(bub);snd('note');
  }
  OS.fifiSay=say;
  function task(id){const t=T.find(x=>x[0]===id);if(!t)return;cur=t;
    if(t[6]){say('Завдання',esc(t[3]),[{t:'Почати',p:1,f:()=>t[6]()},{t:'Пізніше',f:()=>{cur=null;hide()}}]);return}
    say('Завдання',esc(t[3]),[{t:'Як це зробити?',f:el=>{const hw=$('.how',bub);hw.hidden=!hw.hidden;el.remove()}},{t:'Пізніше',f:()=>{cur=null;hide()}}],t[4])}
  function next(after){const l=list(),i=l.findIndex(t=>t[0]===after);return l.slice(i+1).concat(l.slice(0,i)).find(t=>!FS().done[t[0]])}
  function record(){try{const me=window.ITMW&&ITMW.me&&ITMW.me();if(!me)return;const c=JSON.parse(localStorage.getItem('itm-me')||'null');const R=JSON.parse(localStorage.getItem('itm-results')||'{}');const row=R[c.id]=R[c.id]||{};row._name=me.name;row._cls=me.cls;row['Мій перший ПК']={g:null,t:doneN()+' з '+list().length+' завдань Фіфі',d:Date.now()};localStorage.setItem('itm-results',JSON.stringify(R))}catch(e){}}
  const PRAISE=['Молодець!','Супер!','Чудово вийшло!','Так тримати!','Ти справжній майстер!','Ура, вийшло!'];
  OS.on('act',e=>{if(!cur||!cur[5](e))return;const t=cur;cur=null;
    if(!FS().done[t[0]]){FS().done[t[0]]=Date.now();save();record()}
    fb.classList.remove('on');void fb.offsetWidth;fb.classList.add('on');
    const n=next(t[0]);
    setTimeout(()=>{
      if(doneN()===list().length&&list().length){say('Усі завдання виконано!','Ти пройшов усі мої завдання! Я поклала тобі <b>сертифікат</b> у папку «Документи». Знайдеш? 😺',[{t:'Відкрити Документи',p:1,f:()=>{hide();openApp('explorer','docs')}},{t:'Дякую!',f:hide}],null,1);cert();return}
      say(PRAISE[Math.floor(Math.random()*PRAISE.length)]+' ⭐','Завдання «'+esc(t[2])+'» виконано.'+(n?'<br>Далі: <b>'+esc(n[2])+'</b>':''),n?[{t:'Далі',p:1,f:()=>task(n[0])},{t:'Досить',f:hide}]:[{t:'Добре',p:1,f:hide}],null,1)},450)});
  /* сертифікат */
  function cert(){
    const me=window.ITMW&&ITMW.me&&ITMW.me();const name=me?me.name:'';
    const c=document.createElement('canvas');c.width=900;c.height=600;const x=c.getContext('2d');
    const g=x.createLinearGradient(0,0,900,600);g.addColorStop(0,'#fff6dc');g.addColorStop(1,'#efe6ff');x.fillStyle=g;x.fillRect(0,0,900,600);
    x.strokeStyle='#e8b04a';x.lineWidth=10;x.strokeRect(24,24,852,552);x.strokeStyle='#8a7cf0';x.lineWidth=3;x.strokeRect(42,42,816,516);
    x.fillStyle='#3b3450';x.textAlign='center';x.font='800 58px Rubik, Nunito, sans-serif';x.fillText('Сертифікат',450,140);
    x.font='700 24px Nunito, sans-serif';x.fillStyle='#6f6787';x.fillText(name?'вручається':'вручається юному користувачу',450,195);
    if(name){x.font='800 40px Rubik, Nunito, sans-serif';x.fillStyle='#3b3450';x.fillText(name,450,250)}
    x.font='700 24px Nunito, sans-serif';x.fillStyle='#3b3450';x.fillText('за виконання всіх завдань Фіфі',450,310);x.fillText('в «Моєму першому ПК»',450,345);
    const d=new Date();x.font='700 20px Nunito, sans-serif';x.fillStyle='#6f6787';x.fillText(d.getDate()+' '+MONTHS_G[d.getMonth()]+' '+d.getFullYear(),450,520);
    const im=new Image();im.onload=()=>{x.drawImage(im,380,355,140,154);fin()};im.onerror=fin;
    im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(I.fifi(true).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
    function fin(){const data=c.toDataURL('image/png');const ex=F.kids('docs').find(n=>n.ext==='png'&&n.name==='Сертифікат від Фіфі');if(ex)F.write(ex.id,data);else F.mk('docs','Сертифікат від Фіфі','file','png',data)}
  }

  /* ---------- екскурсія «Частини системи» ---------- */
  const firstIcon=()=>$('.sos-icons .sos-it',root);
  const tw=()=>[...OS.wins].reverse().find(w=>!w.el.classList.contains('min'));
  const P={
   desk:{n:'Робочий стіл',d:'Головний екран комп\'ютера. На ньому лежать значки, а позаду — картинка-шпалери.',el:()=>desk,deep:t=>t.closest('.sos-desk')&&!t.closest('.sw')},
   icon:{n:'Значок',d:'Маленька картинка з підписом. Двічі натисни на значок — і відкриється програма, папка чи файл.',el:firstIcon,deep:t=>t.closest('.sos-icons .sos-it')},
   bar:{n:'Панель задач',d:'Смуга внизу екрана. На ній — кнопка «Пуск», відкриті програми й годинник.',el:()=>$('.sos-bar',root),deep:t=>t.closest('.sos-bar')},
   start:{n:'Кнопка «Пуск»',d:'Кнопка ліворуч унизу. Вона відкриває меню з усіма програмами.',el:()=>$('.sos-startb',root),deep:t=>t.closest('.sos-startb')},
   smenu:{n:'Меню «Пуск»',d:'Тут усі програми й пошук. Почни писати назву — і програма знайдеться.',el:()=>$('.sos-start',root),prep:()=>{if(!$('.sos-start',root))openStart()}},
   clock:{n:'Годинник',d:'Праворуч унизу — час і дата. Поруч: мова (UA/EN), звук і я, Фіфі.',el:()=>clockB,deep:t=>t.closest('.sos-clock')},
   win:{n:'Вікно',d:'Кожна програма відкривається у своєму вікні. Вікно можна рухати, згортати й закривати.',el:()=>tw()&&tw().el,deep:t=>t.closest('.sw')},
   title:{n:'Рядок заголовка',d:'Верхня смужка вікна з назвою програми. Потягни за неї — і вікно переїде.',el:()=>tw()&&$('.swt b',tw().el),deep:t=>t.closest('.swt')},
   mbar:{n:'Рядок меню',d:'Слова «Файл», «Правка»… Натисни на слово — відкриється список команд.',el:()=>tw()&&$('.sm-bar',tw().el),deep:t=>t.closest('.sm-bar')},
   min:{n:'Кнопка «Згорнути»',d:'Риска «—» ховає вікно вниз, на панель задач. Програма не закривається.',el:()=>tw()&&$('.mn',tw().el),deep:t=>t.closest('.swt .mn')},
   max:{n:'Кнопка «Розгорнути»',d:'Квадратик робить вікно на весь екран. Натисни ще раз — і воно стане меншим.',el:()=>tw()&&$('.mx',tw().el),deep:t=>t.closest('.swt .mx')},
   close:{n:'Кнопка «Закрити»',d:'Хрестик закриває програму.',el:()=>tw()&&$('.swt .x',tw().el),deep:t=>t.closest('.swt .x')},
   task:{n:'Кнопка програми',d:'Кожна відкрита програма має свою кнопку на панелі задач. Так згорнуте вікно легко повернути.',el:()=>tw()&&tw().task,deep:t=>t.closest('.sos-task')},
   ctx:{n:'Контекстне меню',d:'Меню від правої кнопки мишки. У ньому дії саме для того місця, де ти натиснув.',el:()=>$('.sos-menu',root)||document.querySelector('.sos-menu'),
     prep:()=>{const r=iconsEl.getBoundingClientRect();iconsEl.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:r.left+r.width*.55,clientY:r.top+r.height*.35,button:2}))}},
  };
  const DEEP=['close','max','min','title','mbar','win','start','task','clock','bar','icon','desk'];
  const whatIs=t=>DEEP.find(k=>P[k].deep(t));
  let spot=null,mode=null;
  function spotOn(el,label,cls){if(!el){spotOff();return}const r=el.getBoundingClientRect(),pd=5;
    if(!spot){spot=document.createElement('div');root.appendChild(spot)}
    spot.className='ff-spot '+(r.top>innerHeight*.45?'up':'dn')+(cls?' '+cls:'');
    Object.assign(spot.style,{left:r.left-pd+'px',top:r.top-pd+'px',width:r.width+pd*2+'px',height:r.height+pd*2+'px'});
    spot.innerHTML=label?'<b>'+esc(label)+'</b>':'';const lb=spot.firstChild;
    if(lb){const q=lb.getBoundingClientRect(),dx=q.right>innerWidth-6?innerWidth-6-q.right:q.left<6?6-q.left:0;if(dx)lb.style.transform='translateX(calc(-50% + '+dx+'px))'}}
  function spotOff(){if(spot){spot.remove();spot=null}}
  function hit(x,y,ok){const d=document.createElement('div');d.className='ff-hit'+(ok?' ok':'');d.style.left=x+'px';d.style.top=y+'px';root.appendChild(d);setTimeout(()=>d.remove(),550)}
  function ensureWin(){let W=[...OS.wins].reverse().find(w=>$('.sm-bar',w.el));
    if(!W)W=openApp('notepad');else{W.el.classList.remove('min');W.task.classList.remove('min');focusWin(W)}
    if(W&&W.el.classList.contains('max')&&!small())W.toggleMax();return W}
  const clearDesk=()=>{if(small())OS.wins.forEach(w=>{if(!w.el.classList.contains('min')){w.el.classList.add('min');w.task.classList.add('min')}})};
  /* поки триває екскурсія чи перевірка — кліки по системі не виконують дій */
  function guard(e){if(!mode||!e.isTrusted||e.target.closest('.sos-ff'))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(e.type==='pointerdown'&&mode.click)mode.click(e)}
  ['pointerdown','pointerup','mousedown','mouseup','click','dblclick','contextmenu'].forEach(ev=>addEventListener(ev,guard,true));
  addEventListener('keydown',e=>{if(mode&&e.key==='Escape'){e.preventDefault();stopMode()}},true);
  addEventListener('resize',()=>{if(mode&&mode.redraw)mode.redraw()});
  function stopMode(){mode=null;spotOff();closeMenu();closeStart();hide();if(bub)bub.classList.remove('tour')}
  const dots=(n,i)=>'<div class="ff-dots">'+Array.from({length:n},(_,k)=>`<i class="${k<=i?'on':''}"></i>`).join('')+'</div>';
  function finish(kind){const c=cur;stopMode();cur=c;setTimeout(()=>act({t:kind}),60)}
  function tour(){
    const STEPS=['desk','icon','bar','start','smenu','clock','win','title','mbar','min','max','close','task','ctx'];
    hide();closeStart();closeMenu();
    const t0=cur;let i=0;mode={};
    const show=()=>{const k=STEPS[i],p=P[k];closeMenu();if(k!=='smenu')closeStart();
      if(['win','title','mbar','min','max','close','task'].includes(k))ensureWin();else if(k==='desk'||k==='icon')clearDesk();if(p.prep)p.prep();
      setTimeout(()=>{if(!mode)return;spotOn(p.el(),p.n);mode.redraw=()=>spotOn(p.el(),p.n);
        say('Екскурсія · '+(i+1)+' з '+STEPS.length,'<b>'+esc(p.n)+'</b><br>'+esc(p.d)+dots(STEPS.length,i),
          [...(i?[{t:'Назад',f:()=>{i--;show()}}]:[]),{t:i<STEPS.length-1?'Далі':'Готово',p:1,f:()=>{if(i<STEPS.length-1){i++;show()}else{cur=t0;finish('tour')}}},{t:'Вийти',f:()=>{stopMode();cur=null}}]);
        bub&&bub.classList.add('tour')},k==='smenu'||k==='ctx'?160:60)};
    show()}
  function quiz(){
    hide();closeStart();closeMenu();ensureWin();
    const t0=cur,Q=['bar','start','clock','icon','desk','win','title','mbar','task','min','max','close'].sort(()=>Math.random()-.5);
    let i=0,miss=0,good=0,lock=false;mode={};
    const ask=()=>{miss=0;spotOff();const p=P[Q[i]];ensureWin();if(Q[i]==='desk'||Q[i]==='icon')clearDesk();
      say('Знайди · '+(i+1)+' з '+Q.length,'Натисни на <b>'+esc(p.n)+'</b>'+dots(Q.length,i),[{t:'Підказка',f:()=>spotOn(P[Q[i]].el(),'','lite')},{t:'Вийти',f:()=>{stopMode();cur=null}}]);bub&&bub.classList.add('tour')};
    mode.click=e=>{if(lock)return;const k=whatIs(e.target),want=Q[i];
      if(k===want||(want==='bar'&&k&&P.bar.deep(e.target))){lock=true;if(!miss)good++;hit(e.clientX,e.clientY,1);spotOn(P[want].el(),P[want].n,'ok');snd('open');
        setTimeout(()=>{lock=false;i++;if(i<Q.length)ask();else{const tt=t0;stopMode();cur=tt;
          say('Перевірку завершено!','З першої спроби: <b>'+good+' з '+Q.length+'</b>.'+(good===Q.length?' Ти знаєш комп\'ютер напам\'ять!':' Пройди ще раз — буде ще краще.'),[{t:'Далі',p:1,f:()=>{hide();act({t:'partsquiz'})}}],null,1)}},800);return}
      miss++;hit(e.clientX,e.clientY,0);snd('err');
      const txt=k?'Це <b>'+esc(P[k].n)+'</b>. А треба знайти <b>'+esc(P[want].n)+'</b>.':'Тут немає <b>'+esc(P[want].n)+'</b>.';
      if(miss>=2)spotOn(P[want].el(),'','lite');
      say('Знайди · '+(i+1)+' з '+Q.length,txt+(miss>=2?' Дивись, я підсвітила.':'')+dots(Q.length,i),[{t:'Підказка',f:()=>spotOn(P[Q[i]].el(),'','lite')},{t:'Вийти',f:()=>{stopMode();cur=null}}]);bub&&bub.classList.add('tour')};
    ask()}
  OS.fifiTour=()=>task('tour');
  /* панель */
  let pan=null;
  function closePanel(){if(pan){pan.remove();pan=null}}
  function openPanel(){
    if(pan){closePanel();return}closeStart();closePop();hide();
    const l=list(),dn=doneN();
    pan=h(`<div class="sos-pop" style="width:380px"><div class="ff-hd"><i>${I.fifi(dn===l.length&&l.length>0)}</i><div><b>Завдання від Фіфі</b><small>Виконано ${dn} з ${l.length}</small><div class="ff-bar"><i style="width:${l.length?dn/l.length*100:0}%"></i></div></div></div>
      <div class="ff-list">${SECS.filter(s=>!FS().off[s[0]]).map(([sid,sn])=>`<h4>${sn}</h4>`+T.filter(t=>t[1]===sid).map(t=>`<button class="ff-row${FS().done[t[0]]?' done':''}" data-ft="${t[0]}">${STAR(FS().done[t[0]])}<span>${esc(t[2])}</span></button>`).join('')).join('')}</div>
      <div class="ff-foot">${OS.apps.firstpc?'<button class="sos-btn p" data-fx="pc">Відкрити ФіфіПК</button>':''}${dn===l.length&&l.length?'<button class="sos-btn" data-fx="cert">Сертифікат</button>':''}<button class="sos-btn" data-fx="hide">Сховати</button></div></div>`);
    pan.addEventListener('click',e=>{const r=e.target.closest('[data-ft]');if(r){closePanel();task(r.dataset.ft);return}
      const b=e.target.closest('[data-fx]');if(!b)return;closePanel();if(b.dataset.fx==='pc')openApp('firstpc');if(b.dataset.fx==='cert')openApp('explorer','docs')});
    root.appendChild(pan);fb.classList.add('on');snd('click');
  }
  fb.onclick=e=>{e.stopPropagation();openPanel()};
  document.addEventListener('pointerdown',e=>{if(pan&&!e.target.closest('.sos-pop,.sos-fifib'))closePanel()},true);
  OS.fifiOpen=openPanel;OS.fifiTask=task;
  /* розділ «Урок» у налаштуваннях */
  (opt.settingsSections=opt.settingsSections||[]).unshift(['lesson','Урок','<svg viewBox="0 0 24 24"><path d="M4 5h16v11H4zM8 20h8M12 16v4"/></svg>',body=>{
    const me=window.ITMW&&ITMW.me&&ITMW.me();const base=location.href.split('#')[0];
    body.innerHTML=`<h2>Урок</h2><p style="font-weight:700;color:#6f6787;margin:0 0 12px">Які завдання Фіфі показувати учням:</p>
      ${SECS.map(([sid,sn])=>`<div class="ss-row"><div>${sn}<small>${T.filter(t=>t[1]===sid).length} завдань · посилання: ${esc(base)}#fifi=${sid}</small></div><button class="ss-sw${FS().off[sid]?'':' on'}" data-sec="${sid}" aria-label="${sn}"></button></div>`).join('')}
      <h2 style="margin-top:20px;font-size:18px">Звіт${me?': '+esc(me.name)+', '+esc(me.cls):''}</h2>
      <div class="ss-row" style="display:block;line-height:1.7;font-size:14.5px">${T.map(t=>`${FS().done[t[0]]?'✅':'⬜'} ${esc(t[2])}`).join('<br>')}</div>
      <div class="ss-row"><div>Почати завдання заново<small>Зірочки Фіфі буде скинуто, файли лишаться</small></div><button class="sos-btn" data-ffr>Скинути</button></div>`;
    body.onclick=async e=>{const b=e.target.closest('[data-sec]');if(b){FS().off[b.dataset.sec]=!FS().off[b.dataset.sec];save();b.classList.toggle('on')}
      if(e.target.closest('[data-ffr]')){if(await OS.confirm('Завдання Фіфі','Скинути всі зірочки Фіфі?','Так','Ні','warn')){FS().done={};save();emit('settings')}}}}]);
  /* перше знайомство і посилання для уроку */
  OS.on('ready',()=>{
    const m=location.hash.match(/fifi=([\w-]+)/);
    if(m){const id=m[1];const sec=SECS.find(s=>s[0]===id);let t=sec?T.find(x=>x[1]===id&&!FS().done[x[0]])||T.find(x=>x[1]===id):T.find(x=>x[0]===id);if(t){FS().offered=1;save();setTimeout(()=>task(t[0]),900)}return}
    if(/open=/.test(location.hash))return;
    const pcB=OS.apps.firstpc?[{t:'Відкрити ФіфіПК',f:()=>{hide();openApp('firstpc')}}]:[];
    const later={t:'Пізніше',f:()=>{hide();say('','Добре! Якщо захочеш — я тут, біля годинника 😺',[{t:'Ок',p:1,f:hide}])}};
    if(!FS().offered){FS().offered=1;FS().news=1;save();setTimeout(()=>say('Привіт! Я Фіфі 🐾','Це твій власний комп\'ютер — тут можна все. Показати, як він працює?'+(pcB.length?'<br>А ще на робочому столі є <b>ФіфіПК</b> — мої вправи.':''),[{t:'Так!',p:1,f:()=>{const n=list().find(t=>!FS().done[t[0]]);n?task(n[0]):hide()}},...pcB,later]),1300)}
    else if(!FS().news){FS().news=1;save();setTimeout(()=>say('Новинка 🐾','Я тепер вмію проводити <b>екскурсію комп\'ютером</b>.'+(pcB.length?' А <b>ФіфіПК</b> лежить просто на робочому столі.':''),[{t:'Екскурсія',p:1,f:()=>task('tour')},...pcB,later]),1300)}
  });
}
/* відкрити програму з посилання: #open=firstpc */
OS.on('ready',()=>{const m=location.hash.match(/open=([\w-]+)/);if(m&&OS.apps[m[1]])setTimeout(()=>openApp(m[1]),400)});
if(opt.bootAnim)bootScreen('Вмикаємо комп\'ютер…',1100).then(()=>{if(opt.lock&&opt.lockOnStart)lock();else{snd('boot');emit('ready')}});else if(opt.lock&&opt.lockOnStart)lock();else setTimeout(()=>emit('ready'),0);
OS.wake=()=>bootScreen('Вмикаємо комп\'ютер…',900).then(()=>{snd('boot');desktopView.render()});
OS.state=()=>S;OS.save=save;OS.saveNow=saveNow;
return OS;
}
window.SandOS={boot,icons:I,version:VER};
})();
