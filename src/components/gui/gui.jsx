import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import Alerts from '../../containers/alerts.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ConnectionModal from '../../containers/connection-modal.jsx';
import TelemetryModal from '../telemetry-modal/telemetry-modal.jsx';
import Backpack from '../../containers/backpack.jsx';
import Watermark from '../../containers/watermark.jsx';
import DebugModal from '../debug-modal/debug-modal.jsx';

import layout, { STAGE_SIZE_MODES } from '../../lib/layout-constants';
import { resolveStageSize } from '../../lib/screen-utils';
import { themeMap } from '../../lib/themes';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

let isRendererSupported = null;

const cockpitCSS = `
@keyframes aurora1 {
    0%, 100% { transform: translateX(-10%) scaleY(1); opacity: 0.5; }
    50%       { transform: translateX(10%) scaleY(1.3); opacity: 0.8; }
}
@keyframes aurora2 {
    0%, 100% { transform: translateX(5%) scaleY(1.2); opacity: 0.4; }
    50%       { transform: translateX(-8%) scaleY(0.9); opacity: 0.7; }
}
@keyframes aurora3 {
    0%, 100% { transform: translateX(0%) scaleY(1); opacity: 0.3; }
    33%       { transform: translateX(-5%) scaleY(1.4); opacity: 0.6; }
    66%       { transform: translateX(8%) scaleY(0.8); opacity: 0.5; }
}
@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-15px) rotate(8deg); }
}
.floating-emoji {
    position: absolute;
    animation: float ease-in-out infinite;
    pointer-events: none; user-select: none;
}
@keyframes twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.2; transform: scale(0.6); }
}
.star-dot {
    position: absolute; border-radius: 50%;
    animation: twinkle ease-in-out infinite;
}
@keyframes hud-blink {
    0%,90%,100% { opacity: 1; }
    95%          { opacity: 0.3; }
}
@keyframes sparkle {
    0%   { transform: scale(0) rotate(0deg); opacity: 1; }
    100% { transform: scale(2.5) rotate(180deg); opacity: 0; }
}
.hud-blink { animation: hud-blink 3s ease-in-out infinite; }
.sparkle-effect {
    position: fixed; pointer-events: none; font-size: 20px;
    animation: sparkle 0.6s ease-out forwards; z-index: 9999;
}
.gui-splitter:hover .gui-splitter-line {
    background: rgba(108,190,255,0.9) !important;
    box-shadow: 0 0 16px rgba(108,190,255,0.7) !important;
}
textarea:focus { outline: none; box-shadow: none; }
textarea::-webkit-scrollbar { width: 5px; height: 5px; }
textarea::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
textarea::-webkit-scrollbar-thumb { background: rgba(108,190,255,0.3); border-radius: 3px; }
textarea::-webkit-scrollbar-thumb:hover { background: rgba(108,190,255,0.6); }
`;

const STARS = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${(i * 137.508) % 100}%`,
    left: `${(i * 97.3) % 100}%`,
    size: 1 + (i % 3),
    duration: `${1.5 + (i % 30) / 10}s`,
    delay: `${(i % 40) / 10}s`,
    color: ['#fff', '#ffd93d', '#6bceff', '#ffb3de', '#a8edff'][i % 5],
}));

const EMOJIS_DATA = ['\u2b50', '\ud83c\udf1f', '\u2728', '\ud83d\udcab', '\ud83e\ude90', '\ud83c\udf19', '\u2604\ufe0f', '\ud83d\ude80'].map((emoji, i) => ({
    id: i, emoji,
    top: `${10 + (i * 73) % 80}%`,
    left: `${5 + (i * 113) % 88}%`,
    duration: `${3 + (i % 6)}s`,
    delay: `${(i * 7) % 30 / 10}s`,
    size: `${18 + (i % 12)}px`,
}));

const Stars = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', right: '-10%', height: '60%', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,180,0.45) 0%, rgba(0,200,150,0.2) 40%, transparent 70%)', animation: 'aurora1 8s ease-in-out infinite', borderRadius: '0 0 50% 50%', filter: 'blur(15px)' }} />
        <div style={{ position: 'absolute', top: '-15%', left: '-15%', right: '-5%', height: '55%', background: 'radial-gradient(ellipse 70% 50% at 30% 0%, rgba(80,130,255,0.4) 0%, rgba(50,100,255,0.15) 40%, transparent 70%)', animation: 'aurora2 11s ease-in-out infinite', borderRadius: '0 0 60% 40%', filter: 'blur(18px)' }} />
        <div style={{ position: 'absolute', top: '-10%', left: '10%', right: '-20%', height: '50%', background: 'radial-gradient(ellipse 60% 55% at 70% 0%, rgba(200,80,255,0.38) 0%, rgba(150,50,200,0.15) 40%, transparent 70%)', animation: 'aurora3 14s ease-in-out infinite', borderRadius: '0 0 40% 60%', filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', top: '-5%', left: '20%', right: '-10%', height: '45%', background: 'radial-gradient(ellipse 50% 45% at 60% 0%, rgba(0,230,255,0.3) 0%, rgba(0,180,200,0.1) 40%, transparent 70%)', animation: 'aurora1 17s ease-in-out infinite reverse', borderRadius: '0 0 55% 45%', filter: 'blur(16px)' }} />
        {STARS.map(s => (
            <div key={s.id} className="star-dot" style={{ top: s.top, left: s.left, width: `${s.size}px`, height: `${s.size}px`, background: s.color, boxShadow: `0 0 ${s.size * 2}px ${s.color}`, animationDuration: s.duration, animationDelay: s.delay }} />
        ))}
        {EMOJIS_DATA.map(f => (
            <div key={f.id} className="floating-emoji" style={{ top: f.top, left: f.left, fontSize: f.size, animationDuration: f.duration, animationDelay: f.delay, opacity: 0.7 }}>{f.emoji}</div>
        ))}
    </div>
);

const addClickEffect = (e) => {
    const emojis = ['\u2b50', '\u2728', '\ud83d\udcab', '\ud83c\udf1f', '\ud83c\udf89', '\ud83d\udca5'];
    const el = document.createElement('div');
    el.className = 'sparkle-effect';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${e.clientX - 12}px`;
    el.style.top = `${e.clientY - 12}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
};



/* =============================================
   CONVERTISSEUR BLOCS SCRATCH → PYTHON
   ============================================= */
const scratchToPython = (vm) => {
    if (!vm || !vm.runtime) return null;
    const NL = '\n';
    const lines = [`# Code Python genere depuis les blocs Scratch`, ``];
    let hasCode = false;

    try {
        const targets = vm.runtime.targets || [];
        for (const target of targets) {
            if (!target.blocks || target.isStage) continue;
            const blocks = target.blocks._blocks || {};
            const allIds = Object.keys(blocks);
            const childIds = new Set();
            for (const id of allIds) {
                const b = blocks[id];
                if (b.next) childIds.add(b.next);
                if (b.inputs) {
                    for (const inp of Object.values(b.inputs)) {
                        if (inp.block) childIds.add(inp.block);
                        if (inp.shadow) childIds.add(inp.shadow);
                    }
                }
            }
            const roots = allIds.filter(id => !childIds.has(id) && blocks[id]);

            const blockToCode = (id, indent) => {
                if (!id || !blocks[id]) return ``;
                const b = blocks[id];
                const op = b.opcode || ``;
                const pad = `    `.repeat(indent);
                let code = ``;

                const field = (name) => {
                    const f = b.fields && b.fields[name];
                    return f ? f.value : `0`;
                };
                const inputVal = (name) => {
                    if (!b.inputs || !b.inputs[name]) return `0`;
                    const inp = b.inputs[name];
                    const shadowId = inp.shadow || inp.block;
                    if (!shadowId || !blocks[shadowId]) return `0`;
                    const sb = blocks[shadowId];
                    if (sb.fields) {
                        const vals = Object.values(sb.fields);
                        if (vals.length > 0) return vals[0].value;
                    }
                    return `0`;
                };
                const sub = (key) => {
                    if (!b.inputs || !b.inputs[key]) return `${pad}    pass`;
                    return blockToCode(b.inputs[key].block, indent + 1) || `${pad}    pass`;
                };

                const opMap = {
                    'motion_movesteps': () => `${pad}robot.avancer(pas=${inputVal(`STEPS`)})`,
                    'motion_turnright': () => `${pad}robot.tourner_droite(angle=${inputVal(`DEGREES`)})`,
                    'motion_turnleft': () => `${pad}robot.tourner_gauche(angle=${inputVal(`DEGREES`)})`,
                    'motion_gotoxy': () => `${pad}robot.aller_a(x=${inputVal(`X`)}, y=${inputVal(`Y`)})`,
                    'motion_setx': () => `${pad}robot.set_x(${inputVal(`X`)})`,
                    'motion_sety': () => `${pad}robot.set_y(${inputVal(`Y`)})`,
                    'motion_pointindirection': () => `${pad}robot.orienter(angle=${inputVal(`DIRECTION`)})`,
                    'motion_ifonedge_bounce': () => `${pad}robot.rebondir_si_bord()`,
                    'control_wait': () => `${pad}robot.attendre(secondes=${inputVal(`DURATION`)})`,
                    'control_repeat': () => `${pad}for _ in range(${inputVal(`TIMES`)}):${NL}${sub(`SUBSTACK`)}`,
                    'control_forever': () => `${pad}while True:${NL}${sub(`SUBSTACK`)}`,
                    'control_if': () => `${pad}if True:${NL}${sub(`SUBSTACK`)}`,
                    'control_if_else': () => `${pad}if True:${NL}${sub(`SUBSTACK`)}${NL}${pad}else:${NL}${sub(`SUBSTACK2`)}`,
                    'control_stop': () => `${pad}robot.arreter()`,
                    'control_wait_until': () => `${pad}robot.attendre_condition()`,
                    'looks_say': () => `${pad}robot.afficher(${JSON.stringify(inputVal(`MESSAGE`))})`,
                    'looks_sayforsecs': () => `${pad}robot.afficher(${JSON.stringify(inputVal(`MESSAGE`))}, duree=${inputVal(`SECS`)})`,
                    'sound_play': () => `${pad}robot.jouer_son()`,
                    'sound_stopallsounds': () => `${pad}robot.arreter_sons()`,
                    'event_whenflagclicked': () => `# Quand le drapeau vert est clique${NL}def programme_principal():`,
                    'event_whenkeypressed': () => `# Quand touche "${field(`KEY_OPTION`)}" pressee${NL}def sur_touche_${field(`KEY_OPTION`).replace(` `, `_`)}():`,
                    'event_whenbroadcastreceived': () => `# Message recu: ${field(`BROADCAST_OPTION`)}${NL}def sur_message_${field(`BROADCAST_OPTION`).replace(` `, `_`)}():`,
                    'event_broadcast': () => `${pad}robot.envoyer_message(${JSON.stringify(inputVal(`BROADCAST_INPUT`))})`,
                    'data_setvariableto': () => `${pad}${field(`VARIABLE`)} = ${inputVal(`VALUE`)}`,
                    'data_changevariableby': () => `${pad}${field(`VARIABLE`)} += ${inputVal(`VALUE`)}`,
                    'operator_add': () => `${inputVal(`NUM1`)} + ${inputVal(`NUM2`)}`,
                    'operator_subtract': () => `${inputVal(`NUM1`)} - ${inputVal(`NUM2`)}`,
                    'operator_multiply': () => `${inputVal(`NUM1`)} * ${inputVal(`NUM2`)}`,
                    'operator_divide': () => `${inputVal(`NUM1`)} / ${inputVal(`NUM2`)}`,
                };

                if (opMap[op]) {
                    code = opMap[op]() || ``;
                    hasCode = true;
                } else if (op) {
                    code = `${pad}# [${op}]`;
                }

                if (b.next) {
                    const nextCode = blockToCode(b.next, indent);
                    if (nextCode) code = code ? code + NL + nextCode : nextCode;
                }
                return code;
            };

            for (const rootId of roots) {
                const code = blockToCode(rootId, 0);
                if (code && code.trim()) {
                    lines.push(code);
                    lines.push(``);
                }
            }
        }
    } catch (err) {
        console.warn(`Erreur conversion blocs:`, err);
    }

    if (!hasCode) return null;
    lines.push(`# Lancer le programme`);
    lines.push(`if __name__ == "__main__":`);
    lines.push(`    programme_principal()`);
    return lines.join(NL);
};


const PYTHON_DEFAULT = `# Code Python du Robot
# Modifie ce code et clique Executer !

import robot

# Exemple : avancer puis tourner
robot.avancer(vitesse=50, duree=2)
robot.tourner(angle=90)
robot.arreter()
`;

class GUIComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            splitPct: 50,
            isDragging: false,
            sidebarCollapsed: false,
            vertSplitPct: 40,
            isDraggingVert: false,
            pythonCode: PYTHON_DEFAULT,
            pythonEditedManually: false,
        };
        this.blockUpdateTimer = null;
        this.containerRef = React.createRef();
        this.rightPanelRef = React.createRef();
        this.onMouseDownSplitter = this.onMouseDownSplitter.bind(this);
        this.onMouseDownVertSplitter = this.onMouseDownVertSplitter.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }
    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        if (this.blockUpdateTimer) clearInterval(this.blockUpdateTimer);
    }
    componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        // Poll for block changes every 800ms
        this.blockUpdateTimer = setInterval(() => {
            if (this.state.pythonEditedManually) return;
            const { vm } = this.props;
            const generated = scratchToPython(vm);
            if (generated && generated !== this.state.pythonCode) {
                this.setState({ pythonCode: generated });
            }
        }, 800);
    }
    onMouseDownSplitter(e) { e.preventDefault(); this.setState({ isDragging: true }); }
    onMouseDownVertSplitter(e) { e.preventDefault(); this.setState({ isDraggingVert: true }); }
    onMouseMove(e) {
        if (this.state.isDragging && this.containerRef.current) {
            const rect = this.containerRef.current.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            this.setState({ splitPct: Math.min(Math.max(pct, 25), 75) });
        }
        if (this.state.isDraggingVert && this.rightPanelRef.current) {
            const rect = this.rightPanelRef.current.getBoundingClientRect();
            const pct = ((e.clientY - rect.top) / rect.height) * 100;
            this.setState({ vertSplitPct: Math.min(Math.max(pct, 20), 80) });
        }
    }
    onMouseUp() {
        if (this.state.isDragging) this.setState({ isDragging: false });
        if (this.state.isDraggingVert) this.setState({ isDraggingVert: false });
    }

    render() {
        const {
            accountNavOpen, activeTabIndex, alertsVisible,
            authorId, authorThumbnailUrl, authorUsername,
            basePath, backpackHost, backpackVisible,
            blocksId, blocksTabVisible, cardsVisible,
            canChangeLanguage, canChangeTheme, canCreateNew,
            canEditTitle, canManageFiles, canRemix, canSave,
            canCreateCopy, canShare, canUseCloud, children,
            connectionModalVisible, debugModalVisible,
            enableCommunity, intl, isCreating, isFullScreen,
            isPlayerOnly, isRtl, isShared, isTelemetryEnabled,
            isTotallyNormal, loading, logo, renderLogin,
            onClickAbout, onClickAccountNav, onCloseAccountNav,
            onLogOut, onOpenRegistration, onToggleLoginOpen,
            onActivateTab, onClickLogo, onExtensionButtonClick,
            onProjectTelemetryEvent, onRequestCloseDebugModal,
            onRequestCloseTelemetryModal, onSeeCommunity, onShare,
            onShowPrivacyPolicy, onStartSelectingFileUpload,
            onTelemetryModalCancel, onTelemetryModalOptIn,
            onTelemetryModalOptOut, showComingSoon, stageSizeMode,
            telemetryModalVisible, theme, tipsLibraryVisible, vm,
            ...componentProps
        } = omit(this.props, 'dispatch');

        if (children) return <Box {...componentProps}>{children}</Box>;

        const { splitPct, isDragging, sidebarCollapsed, vertSplitPct, isDraggingVert, pythonCode } = this.state;

        const tabClassNames = {
            tabs: styles.tabs,
            tab: classNames(tabStyles.reactTabsTab, styles.tab),
            tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
            tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
            tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
            tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
        };

        if (isRendererSupported === null) isRendererSupported = Renderer.isSupported();

        return (
            <MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
                const stageSize = resolveStageSize(stageSizeMode, isFullSize);
                return (
                    <Box
                        className={styles.pageWrapper}
                        dir={isRtl ? 'rtl' : 'ltr'}
                        style={{
                            background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 30%, #0a1a35 60%, #06101f 100%)',
                            minHeight: '100vh',
                            position: 'relative',
                            overflow: 'hidden',
                            userSelect: isDragging || isDraggingVert ? 'none' : 'auto',
                            cursor: isDragging ? 'col-resize' : isDraggingVert ? 'row-resize' : 'default',
                        }}
                        onClick={addClickEffect}
                        {...componentProps}
                    >
                        <style>{cockpitCSS}</style>
                        <Stars />

                        {telemetryModalVisible ? <TelemetryModal isRtl={isRtl} isTelemetryEnabled={isTelemetryEnabled} onCancel={onTelemetryModalCancel} onOptIn={onTelemetryModalOptIn} onOptOut={onTelemetryModalOptOut} onRequestClose={onRequestCloseTelemetryModal} onShowPrivacyPolicy={onShowPrivacyPolicy} /> : null}
                        {loading ? <Loader /> : null}
                        {isCreating ? <Loader messageId="gui.loader.creating" /> : null}
                        {isRendererSupported ? null : <WebGlModal isRtl={isRtl} />}
                        {tipsLibraryVisible ? <TipsLibrary /> : null}
                        {cardsVisible ? <Cards /> : null}
                        {alertsVisible ? <Alerts className={styles.alertsContainer} /> : null}
                        {connectionModalVisible ? <ConnectionModal vm={vm} /> : null}
                        {<DebugModal isOpen={debugModalVisible} onClose={onRequestCloseDebugModal} />}

                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <MenuBar
                                accountNavOpen={accountNavOpen} authorId={authorId}
                                authorThumbnailUrl={authorThumbnailUrl} authorUsername={authorUsername}
                                canChangeLanguage={canChangeLanguage} canChangeTheme={canChangeTheme}
                                canCreateCopy={canCreateCopy} canCreateNew={canCreateNew}
                                canEditTitle={canEditTitle} canManageFiles={canManageFiles}
                                canRemix={canRemix} canSave={canSave} canShare={canShare}
                                className={styles.menuBarPosition} enableCommunity={enableCommunity}
                                isShared={isShared} isTotallyNormal={isTotallyNormal}
                                logo={logo} renderLogin={renderLogin} showComingSoon={showComingSoon}
                                onClickAbout={onClickAbout} onClickAccountNav={onClickAccountNav}
                                onClickLogo={onClickLogo} onCloseAccountNav={onCloseAccountNav}
                                onLogOut={onLogOut} onOpenRegistration={onOpenRegistration}
                                onProjectTelemetryEvent={onProjectTelemetryEvent}
                                onSeeCommunity={onSeeCommunity} onShare={onShare}
                                onStartSelectingFileUpload={onStartSelectingFileUpload}
                                onToggleLoginOpen={onToggleLoginOpen}
                            />
                        </div>

                        <Box
                            ref={this.containerRef}
                            style={{
                                display: 'flex', flexDirection: 'row',
                                height: 'calc(100vh - 40px)',
                                overflow: 'hidden', position: 'relative', zIndex: 5,
                            }}
                        >
                            {/* ===== GAUCHE — BLOCS ===== */}
                            <Box style={{
                                width: `${splitPct}%`, flexShrink: 0,
                                display: 'flex', flexDirection: 'column',
                                background: 'rgba(6,12,32,0.82)', backdropFilter: 'blur(12px)',
                                overflow: 'hidden',
                                border: '1px solid rgba(60,130,220,0.3)',
                                borderTop: '1px solid rgba(100,170,255,0.45)',
                                boxShadow: '0 0 20px rgba(40,100,200,0.12), inset 0 1px 0 rgba(150,200,255,0.12)',
                            }}>
                                <style>{`
                                    .blocklyText { fill: #ffffff !important; }
                                    .blocklyHtmlInput { color: #ffffff !important; }
                                    .blocklyToolboxDiv { background: rgba(4,8,24,0.97) !important; border-right: 1px solid rgba(60,120,200,0.2) !important; padding: 6px 0 !important; overflow: hidden !important; }
                                    .scratchCategoryMenu { background: transparent !important; padding: 4px 6px !important; }
                                    .sidebar-collapsed .scratchCategoryMenuItemLabel { display: none !important; }
                                    .sidebar-collapsed .scratchCategoryMenuItem { justify-content: center !important; padding: 8px 4px !important; }
                                    .sidebar-collapsed .blocklyToolboxDiv { width: 46px !important; }
                                    .scratchCategoryMenuItem { color: #c8ddf0 !important; border-radius: 10px !important; margin: 2px 0 !important; padding: 7px 10px 7px 8px !important; font-size: 12px !important; font-weight: 600 !important; transition: all 0.2s !important; position: relative !important; display: flex !important; align-items: center !important; gap: 6px !important; }
                                    .scratchCategoryMenuItem:hover { color: #ffffff !important; background: rgba(60,130,220,0.15) !important; padding-left: 12px !important; }
                                    .scratchCategoryMenuItemSelected { color: #ffffff !important; background: rgba(60,130,220,0.2) !important; padding-left: 12px !important; box-shadow: inset 0 0 0 1px rgba(80,160,255,0.25) !important; }
                                    .scratchCategoryMenuItemBubble { border-color: rgba(255,255,255,0.15) !important; transition: transform 0.2s ease !important; flex-shrink: 0 !important; }
                                    .scratchCategoryMenuItem:hover .scratchCategoryMenuItemBubble { transform: scale(1.15) !important; }
                                    .scratchCategoryMenuItemSelected .scratchCategoryMenuItemBubble { transform: scale(1.2) !important; }
                                    .blocklyFlyoutBackground { fill: rgba(3,7,20,0.96) !important; }
                                    [class*="blocksWrapper"] { background: transparent !important; }
                                    [class*="editorWrapper"] { background: transparent !important; }
                                    [class*="tabPanel"] { background: transparent !important; }
                                    .blocklyScrollbarHandle { fill: rgba(80,150,230,0.3) !important; }
                                `}</style>

                                <div style={{ padding: '8px 12px', background: 'linear-gradient(90deg, rgba(108,190,255,0.15), rgba(192,132,252,0.15))', borderBottom: '1px solid rgba(108,190,255,0.25)', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                    <span style={{ fontSize: '15px' }}>🧩</span>
                                    <span style={{ background: 'linear-gradient(90deg, #6bceff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Zone de Programmation</span>
                                    <button
                                        onClick={e => { e.stopPropagation(); this.setState(s => ({ sidebarCollapsed: !s.sidebarCollapsed })); }}
                                        style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(108,190,255,0.12)', border: '1px solid rgba(108,190,255,0.3)', borderRadius: '6px', color: '#6bceff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}
                                    >{sidebarCollapsed ? '\u203a' : '\u2039'}</button>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                                        {['#ff6b6b', '#ffd93d', '#6bceff'].map((c, i) => (
                                            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
                                        ))}
                                    </div>
                                </div>

                                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} className={sidebarCollapsed ? 'sidebar-collapsed' : ''}>
                                    <Tabs forceRenderTabPanel className={tabClassNames.tabs} selectedIndex={activeTabIndex} selectedTabClassName={tabClassNames.tabSelected} selectedTabPanelClassName={tabClassNames.tabPanelSelected} onSelect={onActivateTab}>
                                        <TabList className={tabClassNames.tabList} style={{ background: 'rgba(10,25,55,0.65)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(108,190,255,0.2)', padding: '0 8px' }}>
                                            <Tab className={tabClassNames.tab} style={{ color: '#6bceff', fontSize: '12px', letterSpacing: '1px' }}>
                                                <img draggable={false} src={codeIcon} style={{ filter: 'hue-rotate(180deg) brightness(1.5)' }} />
                                                <FormattedMessage defaultMessage="Code" description="Button to get to the code panel" id="gui.gui.codeTab" />
                                            </Tab>
                                        </TabList>
                                        <TabPanel className={tabClassNames.tabPanel} style={{ height: '100%' }}>
                                            <Box className={styles.blocksWrapper} style={{ height: '100%' }}>
                                                <Blocks key={`${blocksId}/${theme}`} canUseCloud={canUseCloud} grow={1} isVisible={blocksTabVisible} options={{ media: `${basePath}static/${themeMap[theme].blocksMediaFolder}/` }} stageSize={stageSize} theme={theme} vm={vm} />
                                            </Box>
                                            <Box className={styles.extensionButtonContainer}>
                                                <button className={styles.extensionButton} title={intl.formatMessage(messages.addExtension)} onClick={onExtensionButtonClick} style={{ background: 'linear-gradient(135deg, rgba(0,80,180,0.9), rgba(108,190,255,0.7))', border: '2px solid rgba(108,190,255,0.7)', borderRadius: '50%', boxShadow: '0 0 20px rgba(108,190,255,0.5)' }}>
                                                    <img className={styles.extensionButtonIcon} draggable={false} src={addExtensionIcon} />
                                                </button>
                                            </Box>
                                            <Box className={styles.watermark}><Watermark /></Box>
                                        </TabPanel>
                                    </Tabs>
                                </div>
                                {backpackVisible ? <Backpack host={backpackHost} /> : null}
                            </Box>

                            {/* ===== SPLITTER VERTICAL ===== */}
                            <div className="gui-splitter" onMouseDown={this.onMouseDownSplitter} style={{ width: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'col-resize', background: 'transparent', zIndex: 20, position: 'relative' }}>
                                <div className="gui-splitter-line" style={{ width: '2px', height: '100%', background: isDragging ? 'rgba(108,190,255,0.9)' : 'rgba(108,190,255,0.25)', boxShadow: isDragging ? '0 0 14px rgba(108,190,255,0.7)' : 'none', transition: 'background 0.2s, box-shadow 0.2s', borderRadius: '2px' }} />
                                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '44px', background: isDragging ? 'rgba(108,190,255,0.25)' : 'rgba(108,190,255,0.1)', border: '1px solid rgba(108,190,255,0.3)', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: isDragging ? '#6bceff' : 'rgba(108,190,255,0.6)' }} />
                                    ))}
                                </div>
                            </div>

                            {/* ===== DROITE — CODE PYTHON + SIMULATEUR ===== */}
                            <div
                                ref={this.rightPanelRef}
                                style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(4,9,24,0.75)', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(60,130,220,0.3)', borderTop: '1px solid rgba(100,170,255,0.4)' }}
                            >
                                {/* ── ÉDITEUR PYTHON (haut) ── */}
                                <div style={{ height: `${vertSplitPct}%`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, background: 'rgba(3,7,18,0.97)' }}>
                                    {/* Header Python */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', flexShrink: 0, background: 'rgba(108,190,255,0.06)', borderBottom: '1px solid rgba(108,190,255,0.15)' }}>
                                        <span style={{ color: '#6bceff', fontWeight: '800', fontSize: '11px', letterSpacing: '2px', fontFamily: 'monospace', textShadow: '0 0 8px rgba(108,190,255,0.6)' }}>CODE PYTHON</span>
                                        <div style={{ flex: 1 }} />
                                        {this.state.pythonEditedManually && (
                                            <button
                                                title="Resynchroniser avec les blocs"
                                                onClick={() => this.setState({ pythonEditedManually: false })}
                                                style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.35)', color: '#c084fc', fontFamily: 'monospace', transition: 'all 0.15s' }}
                                            >&#x21c4; Sync</button>
                                        )}
                                        <button
                                            title="Executer"
                                            onClick={() => { }}
                                            style={{ padding: '3px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(108,190,255,0.15))', border: '1px solid rgba(0,255,136,0.4)', color: '#4fffb0', fontFamily: 'monospace', transition: 'all 0.15s' }}
                                        >&#x25b6; Executer</button>
                                        <button
                                            title="Copier"
                                            onClick={() => navigator.clipboard && navigator.clipboard.writeText(pythonCode)}
                                            style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd93d', fontFamily: 'monospace', transition: 'all 0.15s' }}
                                        >&#x2398; Copier</button>
                                        <button
                                            title="Reinitialiser"
                                            onClick={() => this.setState({ pythonCode: PYTHON_DEFAULT, pythonEditedManually: false })}
                                            style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', background: 'rgba(108,190,255,0.06)', border: '1px solid rgba(108,190,255,0.25)', color: '#6bceff', fontFamily: 'monospace', transition: 'all 0.15s' }}
                                        >&#x21ba; Reset</button>
                                    </div>

                                    {/* Editeur avec numeros de lignes */}
                                    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
                                        <div
                                            id="py-line-nums"
                                            aria-hidden="true"
                                            style={{ width: '38px', flexShrink: 0, overflowY: 'hidden', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(108,190,255,0.1)', fontFamily: "'Courier New', monospace", fontSize: '12px', lineHeight: '20px', color: 'rgba(108,190,255,0.35)', paddingTop: '8px', textAlign: 'right', paddingRight: '6px', userSelect: 'none' }}
                                        >
                                            {pythonCode.split('\n').map((_, i) => (
                                                <div key={i}>{i + 1}</div>
                                            ))}
                                        </div>
                                        <textarea
                                            value={pythonCode}
                                            onChange={e => this.setState({ pythonCode: e.target.value, pythonEditedManually: true })}
                                            spellCheck={false}
                                            style={{ flex: 1, resize: 'none', border: 'none', outline: 'none', background: 'transparent', color: '#c8ddf0', fontFamily: "'Courier New', monospace", fontSize: '12px', lineHeight: '20px', padding: '8px 10px', caretColor: '#6bceff', overflowY: 'auto', overflowX: 'auto', whiteSpace: 'pre', tabSize: 4 }}
                                            onScroll={e => { const ln = document.getElementById('py-line-nums'); if (ln) ln.scrollTop = e.target.scrollTop; }}
                                            onKeyDown={e => {
                                                if (e.key === 'Tab') {
                                                    e.preventDefault();
                                                    const s = e.target.selectionStart;
                                                    const end = e.target.selectionEnd;
                                                    const val = pythonCode;
                                                    this.setState({ pythonCode: val.substring(0, s) + '    ' + val.substring(end) }, () => { e.target.selectionStart = e.target.selectionEnd = s + 4; });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* ── SPLITTER HORIZONTAL ── */}
                                <div
                                    onMouseDown={this.onMouseDownVertSplitter}
                                    style={{ height: '8px', flexShrink: 0, cursor: 'row-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDraggingVert ? 'rgba(108,190,255,0.15)' : 'rgba(108,190,255,0.04)', borderTop: `1px solid ${isDraggingVert ? 'rgba(108,190,255,0.7)' : 'rgba(108,190,255,0.2)'}`, borderBottom: `1px solid ${isDraggingVert ? 'rgba(108,190,255,0.7)' : 'rgba(108,190,255,0.2)'}`, userSelect: 'none', zIndex: 10 }}
                                >
                                    <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: isDraggingVert ? '#6bceff' : 'rgba(108,190,255,0.35)', boxShadow: isDraggingVert ? '0 0 10px #6bceff' : 'none', transition: 'all 0.2s' }} />
                                </div>

                                {/* ── SIMULATEUR (bas) ── */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', minHeight: 0 }}>
                                    <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', fontSize: '16px', letterSpacing: '3px', textTransform: 'uppercase', zIndex: 10, whiteSpace: 'nowrap', background: 'linear-gradient(90deg, #6bceff, #c084fc, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))' }}>🌌 Simulateur Robot 🤖</div>

                                    <div style={{ position: 'absolute', top: '52px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 }}>
                                        <div className="hud-blink" style={{ padding: '3px 12px', borderRadius: '4px', background: 'rgba(255,60,60,0.12)', border: '1px solid rgba(255,80,80,0.5)', color: '#ff6b6b', fontSize: '10px', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6b6b', display: 'inline-block', boxShadow: '0 0 8px #ff6b6b' }} />
                                            OFFLINE
                                        </div>

                                    </div>

                                    <div style={{ width: '88%', height: '68%', border: '2px solid transparent', borderRadius: '16px', background: 'linear-gradient(rgba(5,12,32,0.9), rgba(5,12,32,0.9)) padding-box, linear-gradient(135deg, rgba(100,170,255,0.5), rgba(40,80,180,0.3), rgba(80,140,240,0.5)) border-box', boxShadow: '0 0 0 4px rgba(10,20,50,0.8), 0 0 40px rgba(40,100,220,0.12), inset 0 0 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'radial-gradient(ellipse 70% 50% at 30% 0%, rgba(100,170,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
                                        <div style={{ fontSize: '56px', filter: 'drop-shadow(0 0 20px rgba(80,160,255,0.4))' }}>🤖</div>
                                    </div>

                                    <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10, alignItems: 'center' }}>
                                        <span style={{ color: 'rgba(80,140,220,0.6)', fontSize: '9px', letterSpacing: '2px', fontFamily: 'monospace', marginRight: '4px' }}>CMD</span>
                                        {[
                                            { icon: '\u25b2', color: '#6bceff', label: 'FWD' },
                                            { icon: '\u25c4', color: '#a78bfa', label: 'L' },
                                            { icon: '\u25a0', color: '#f87171', label: 'STP' },
                                            { icon: '\u25ba', color: '#a78bfa', label: 'R' },
                                            { icon: '\u25bc', color: '#6bceff', label: 'BCK' },
                                        ].map((btn, i) => (
                                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                <button style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, rgba(6,12,32,0.9), rgba(10,20,45,0.8))', border: `1px solid ${btn.color}44`, borderTop: `1px solid ${btn.color}66`, borderRadius: '8px', color: btn.color, fontSize: '13px', cursor: 'pointer', boxShadow: `0 0 8px ${btn.color}22`, fontWeight: 'bold', textShadow: `0 0 8px ${btn.color}`, transition: 'all 0.15s' }}>{btn.icon}</button>
                                                <span style={{ color: `${btn.color}88`, fontSize: '7px', letterSpacing: '1px', fontFamily: 'monospace' }}>{btn.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Box>

                        <DragLayer />
                    </Box>
                );
            }}</MediaQuery>
        );
    }
}

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    blocksId: PropTypes.string,
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    connectionModalVisible: PropTypes.bool,
    debugModalVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isTotallyNormal: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseDebugModal: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    showComingSoon: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    telemetryModalVisible: PropTypes.bool,
    theme: PropTypes.string,
    tipsLibraryVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: './',
    blocksId: 'original',
    canChangeLanguage: true,
    canChangeTheme: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    isTotallyNormal: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large
};

const mapStateToProps = state => ({
    blocksId: state.scratchGui.timeTravel.year.toString(),
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    theme: state.scratchGui.theme.theme
});

export default injectIntl(connect(mapStateToProps)(GUIComponent));