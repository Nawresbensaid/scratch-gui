import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import bowser from 'bowser';
import React from 'react';

import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import CommunityButton from './community-button.jsx';
import ShareButton from './share-button.jsx';
import { ComingSoonTooltip } from '../coming-soon/coming-soon.jsx';
import Divider from '../divider/divider.jsx';
import SaveStatus from './save-status.jsx';
import ProjectWatcher from '../../containers/project-watcher.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import { MenuItem, MenuSection } from '../menu/menu.jsx';
import ProjectTitleInput from './project-title-input.jsx';
import AuthorInfo from './author-info.jsx';
import AccountNav from '../../containers/account-nav.jsx';
import LoginDropdown from './login-dropdown.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import TurboMode from '../../containers/turbo-mode.jsx';
import MenuBarHOC from '../../containers/menu-bar-hoc.jsx';
import SettingsMenu from './settings-menu.jsx';

import { openTipsLibrary, openDebugModal } from '../../reducers/modals';
import { setPlayer } from '../../reducers/mode';
import {
    isTimeTravel220022BC,
    isTimeTravel1920,
    isTimeTravel1990,
    isTimeTravel2020,
    isTimeTravelNow,
    setTimeTravel
} from '../../reducers/time-travel';
import {
    autoUpdateProject,
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    remixProject,
    saveProjectAsCopy
} from '../../reducers/project-state';
import {
    openAboutMenu,
    closeAboutMenu,
    aboutMenuOpen,
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen,
    openModeMenu,
    closeModeMenu,
    modeMenuOpen,
    settingsMenuOpen,
    openSettingsMenu,
    closeSettingsMenu
} from '../../reducers/menus';

import collectMetadata from '../../lib/collect-metadata';

import styles from './menu-bar.css';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import mystuffIcon from './icon--mystuff.png';
import profileIcon from './icon--profile.png';
import remixIcon from './icon--remix.svg';
import dropdownCaret from './dropdown-caret.svg';
import aboutIcon from './icon--about.svg';
import fileIcon from './icon--file.svg';
import editIcon from './icon--edit.svg';
import debugIcon from '../debug-modal/icons/icon--debug.svg';

import scratchLogo from './scratch-logo.svg';
import ninetiesLogo from './nineties_logo.svg';
import catLogo from './cat_logo.svg';
import prehistoricLogo from './prehistoric-logo.svg';
import oldtimeyLogo from './oldtimey-logo.svg';

import sharedMessages from '../../lib/shared-messages';

/* =============================================
   THÈME SOMBRE / TECH — Styles inline
   ============================================= */
const darkTheme = {
    menuBar: {
        background: 'rgba(8, 15, 40, 0.45)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(108,190,255,0.18)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3), 0 1px 0 rgba(108,190,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
        color: '#e2d9f3',
    },
    menuBarItem: {
        color: '#6bceff',
        transition: 'all 0.2s ease',
    },
};

/* Icônes SVG inline — pas besoin de Lucide */
const IconBot = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6bceff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" />
        <line x1="12" y1="7" x2="12" y2="11" /><line x1="8" y1="15" x2="8" y2="15" />
        <line x1="16" y1="15" x2="16" y2="15" />
    </svg>
);
const IconMenu = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);
const IconX = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const IconBook = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);
const IconBug = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M8 2l1.5 1.5" /><path d="M14.5 3.5L16 2" /><path d="M9 9h6" /><path d="M9 12h6" />
        <path d="M12 3a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4z" />
        <path d="M5 8H3" /><path d="M21 8h-2" /><path d="M5 16H3" /><path d="M21 16h-2" />
    </svg>
);
const IconTrophy = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
);
const IconStar = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const IconZap = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

/* CSS hover animations injecté une fois */
const navbarCSS = `
.nb-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 6px 13px;
    background: rgba(108,190,255,0.07);
    border: 1px solid rgba(108,190,255,0.2);
    border-radius: 10px;
    color: #8dd4f0;
    font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(.4,0,.2,1);
    position: relative; overflow: hidden;
}
.nb-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(108,190,255,0.15), rgba(192,132,252,0.1));
    opacity: 0; transition: opacity 0.22s;
    border-radius: 10px;
}
.nb-btn:hover { 
    color: #ffffff;
    border-color: rgba(108,190,255,0.55);
    box-shadow: 0 0 16px rgba(108,190,255,0.25), 0 2px 8px rgba(0,0,0,0.2);
    transform: translateY(-1px);
}
.nb-btn:hover::before { opacity: 1; }
.nb-btn:active { transform: translateY(0px) scale(0.97); }

.nb-btn-open {
    background: linear-gradient(135deg, rgba(108,190,255,0.22), rgba(192,132,252,0.18)) !important;
    border-color: rgba(108,190,255,0.5) !important;
    color: #ffffff !important;
    box-shadow: 0 0 20px rgba(108,190,255,0.3) !important;
}

.nb-menu-item {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 9px 12px;
    background: transparent; border: none;
    border-radius: 8px; color: #c8d8f0;
    font-size: 13px; text-align: left; cursor: pointer;
    transition: all 0.18s ease;
}
.nb-menu-item:hover {
    background: rgba(108,190,255,0.12);
    color: #ffffff;
    padding-left: 16px;
}
.nb-section-label {
    color: rgba(108,190,255,0.5);
    font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 6px 12px 4px;
}
.nb-divider { height: 1px; background: rgba(108,190,255,0.1); margin: 5px 8px; }


/* === SCORE & LEVEL === */
@keyframes scoreUp {
    0%   { transform: translateY(0) scale(1); }
    50%  { transform: translateY(-4px) scale(1.15); }
    100% { transform: translateY(0) scale(1); }
}
@keyframes levelUp {
    0%   { box-shadow: 0 0 8px #FFD700; }
    50%  { box-shadow: 0 0 24px #FFD700, 0 0 48px #FFD700; }
    100% { box-shadow: 0 0 8px #FFD700; }
}
.score-badge {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px;
    background: rgba(255,215,0,0.08);
    border: 1px solid rgba(255,215,0,0.3);
    border-radius: 10px;
    color: #FFD700;
    font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
    font-family: monospace;
    transition: all 0.3s ease;
}
.score-badge:hover { background: rgba(255,215,0,0.15); border-color: rgba(255,215,0,0.6); }
.level-badge {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px;
    background: rgba(255,0,255,0.08);
    border: 1px solid rgba(255,0,255,0.3);
    border-radius: 10px;
    color: #FF00FF;
    font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
    animation: levelUp 3s ease-in-out infinite;
}
.leaderboard-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 1000;
    background: rgba(8,10,28,0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,215,0,0.25);
    border-radius: 14px;
    padding: 12px;
    min-width: 260px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
}
.lb-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 8px;
    transition: background 0.15s;
    cursor: default;
}
.lb-row:hover { background: rgba(255,215,0,0.06); }
.lb-rank {
    width: 22px; text-align: center;
    font-size: 13px; font-weight: 800; font-family: monospace;
}
.lb-name { flex: 1; font-size: 12px; color: #c8d8f0; font-weight: 600; }
.lb-score { font-size: 12px; color: #FFD700; font-weight: 700; font-family: monospace; }

.nb-title {
    font-size: 14px; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase;
    background: linear-gradient(90deg, #6bceff 0%, #a78bfa 50%, #f472b6 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 8px rgba(108,190,255,0.4));
    display: flex; align-items: center; gap: 8px;
    padding: 0 14px;
    animation: titlePulse 4s ease-in-out infinite;
}
@keyframes titlePulse {
    0%, 100% { filter: drop-shadow(0 0 6px rgba(108,190,255,0.3)); }
    50% { filter: drop-shadow(0 0 14px rgba(192,132,252,0.5)); }
}
`;

const ariaMessages = defineMessages({
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button'
    },
    debug: {
        id: 'gui.menuBar.debug',
        defaultMessage: 'Debug',
        description: 'accessibility text for the debug button'
    }
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({ id, isRtl, children, className }) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? 'left' : 'right'}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool
};

const AboutButton = props => (
    <Button
        className={classNames(styles.menuBarItem, styles.hoverable)}
        iconClassName={styles.aboutIcon}
        iconSrc={aboutIcon}
        onClick={props.onClick}
    />
);

AboutButton.propTypes = {
    onClick: PropTypes.func.isRequired
};


const sectionLabel = {
    color: 'rgba(108,190,255,0.6)',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 10px 6px',
};
const menuBtnStyle = {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#e2d9f3',
    fontSize: '13px',
    textAlign: 'left',
    cursor: 'pointer',
};
const dividerStyle = {
    height: '1px',
    background: 'rgba(108,190,255,0.15)',
    margin: '6px 8px',
};

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hamburgerOpen: false,
            leaderboardOpen: false,
            score: 8750,
            level: 3,
        };
        bindAll(this, [
            'handleClickNew',
            'closeLeaderboard',
            'handleClickRemix',
            'handleClickSave',
            'handleClickSaveAsCopy',
            'handleClickSeeCommunity',
            'handleClickShare',
            'handleSetMode',
            'handleKeyPress',
            'handleRestoreOption',
            'getSaveToComputerHandler',
            'restoreOptionMessage',
            'toggleHamburger',
            'closeHamburger'
        ]);
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    toggleHamburger(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState(s => ({ hamburgerOpen: !s.hamburgerOpen }));
    }
    closeHamburger() {
        this.setState({ hamburgerOpen: false });
    }
    closeLeaderboard() {
        this.setState({ leaderboardOpen: false });
    }
    handleClickNew() {
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onRequestCloseFile();
        if (readyToReplaceProject) {
            this.props.onClickNew(this.props.canSave && this.props.canCreateNew);
        }
        this.props.onRequestCloseFile();
    }
    handleClickRemix() {
        this.props.onClickRemix();
        this.props.onRequestCloseFile();
    }
    handleClickSave() {
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }
    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }
    handleClickSeeCommunity(waitForUpdate) {
        if (this.props.shouldSaveBeforeTransition()) {
            this.props.autoUpdateProject();
            waitForUpdate(true);
        } else {
            waitForUpdate(false);
        }
    }
    handleClickShare(waitForUpdate) {
        if (!this.props.isShared) {
            if (this.props.canShare) {
                this.props.onShare();
            }
            if (this.props.canSave) {
                this.props.autoUpdateProject();
                waitForUpdate(true);
            } else {
                waitForUpdate(false);
            }
        }
    }
    handleSetMode(mode) {
        return () => {
            if (mode === '1920') {
                document.documentElement.style.filter = 'brightness(.9)contrast(.8)sepia(1.0)';
                document.documentElement.style.height = '100%';
            } else if (mode === '1990') {
                document.documentElement.style.filter = 'hue-rotate(40deg)';
                document.documentElement.style.height = '100%';
            } else {
                document.documentElement.style.filter = '';
                document.documentElement.style.height = '';
            }

            if (mode === '1990') {
                document.getElementById('logo_img').src = ninetiesLogo;
            } else if (mode === '2020') {
                document.getElementById('logo_img').src = catLogo;
            } else if (mode === '1920') {
                document.getElementById('logo_img').src = oldtimeyLogo;
            } else if (mode === '220022BC') {
                document.getElementById('logo_img').src = prehistoricLogo;
            } else {
                document.getElementById('logo_img').src = this.props.logo;
            }

            this.props.onSetTimeTravelMode(mode);
        };
    }
    handleRestoreOption(restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleKeyPress(event) {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === 's') {
            this.props.onClickSave();
            event.preventDefault();
        }
    }
    getSaveToComputerHandler(downloadProjectCallback) {
        return () => {
            this.props.onRequestCloseFile();
            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(this.props.vm, this.props.projectTitle, this.props.locale);
                this.props.onProjectTelemetryEvent('projectDidSave', metadata);
            }
        };
    }
    restoreOptionMessage(deletedItem) {
        switch (deletedItem) {
            case 'Sprite':
                return (<FormattedMessage
                    defaultMessage="Restore Sprite"
                    description="Menu bar item for restoring the last deleted sprite."
                    id="gui.menuBar.restoreSprite"
                />);
            case 'Sound':
                return (<FormattedMessage
                    defaultMessage="Restore Sound"
                    description="Menu bar item for restoring the last deleted sound."
                    id="gui.menuBar.restoreSound"
                />);
            case 'Costume':
                return (<FormattedMessage
                    defaultMessage="Restore Costume"
                    description="Menu bar item for restoring the last deleted costume."
                    id="gui.menuBar.restoreCostume"
                />);
            default: {
                return (<FormattedMessage
                    defaultMessage="Restore"
                    description="Menu bar item for restoring the last deleted item in its disabled state."
                    id="gui.menuBar.restore"
                />);
            }
        }
    }
    buildAboutMenu(onClickAbout) {
        if (!onClickAbout) {
            return null;
        }
        if (typeof onClickAbout === 'function') {
            return <AboutButton onClick={onClickAbout} />;
        }
        return (
            <div
                className={classNames(styles.menuBarItem, styles.hoverable, {
                    [styles.active]: this.props.aboutMenuOpen
                })}
                onMouseUp={this.props.onRequestOpenAbout}
            >
                <img
                    className={styles.aboutIcon}
                    src={aboutIcon}
                />
                <MenuBarMenu
                    className={styles.menuBarMenu}
                    open={this.props.aboutMenuOpen}
                    place={this.props.isRtl ? 'left' : 'right'}
                    onRequestClose={this.props.onRequestCloseAbout}
                >
                    {
                        onClickAbout.map(itemProps => (
                            <MenuItem
                                key={itemProps.title}
                                isRtl={this.props.isRtl}
                                onClick={this.wrapAboutMenuCallback(itemProps.onClick)}
                            >
                                {itemProps.title}
                            </MenuItem>
                        ))
                    }
                </MenuBarMenu>
            </div>
        );
    }
    wrapAboutMenuCallback(callback) {
        return () => {
            callback();
            this.props.onRequestCloseAbout();
        };
    }
    render() {
        const saveNowMessage = (
            <FormattedMessage
                defaultMessage="Save now"
                description="Menu bar item for saving now"
                id="gui.menuBar.saveNow"
            />
        );
        const createCopyMessage = (
            <FormattedMessage
                defaultMessage="Save as a copy"
                description="Menu bar item for saving as a copy"
                id="gui.menuBar.saveAsCopy"
            />
        );
        const remixMessage = (
            <FormattedMessage
                defaultMessage="Remix"
                description="Menu bar item for remixing"
                id="gui.menuBar.remix"
            />
        );
        const newProjectMessage = (
            <FormattedMessage
                defaultMessage="New"
                description="Menu bar item for creating a new project"
                id="gui.menuBar.new"
            />
        );
        const remixButton = (
            <Button
                className={classNames(
                    styles.menuBarButton,
                    styles.remixButton
                )}
                iconClassName={styles.remixButtonIcon}
                iconSrc={remixIcon}
                onClick={this.handleClickRemix}
            >
                {remixMessage}
            </Button>
        );
        const aboutButton = this.buildAboutMenu(this.props.onClickAbout);
        return (
            <Box
                className={classNames(this.props.className, styles.menuBar)}
                style={darkTheme.menuBar}
            >
                <style>{navbarCSS}</style>
                <div className={styles.mainMenu}>

                    {/* GAUCHE — TITRE */}
                    <div className={styles.fileGroup}>
                        <div className="nb-title">
                            <IconBot />
                            NomadVerse
                        </div>
                    </div>



                    {/* CENTRE — LEVEL + SCORE */}
                    <div style={{
                        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        pointerEvents: 'none',
                    }}>
                        <div className="level-badge" style={{ pointerEvents: 'auto' }}>
                            <IconZap />
                            <span>Level</span>
                        </div>
                        <div className="score-badge" style={{ pointerEvents: 'auto' }}>
                            <IconStar />
                            <span>Score</span>
                        </div>
                    </div>

                    {/* DROITE — TUTORIELS | DEBUG | MENU */}
                    <div className={styles.fileGroup} style={{ marginLeft: 'auto', gap: '6px', alignItems: 'center' }}>

                        <button className="nb-btn" onClick={this.props.onOpenTipLibrary} title="Tutoriels">
                            <IconBook />
                            <span>Tutoriels</span>
                        </button>

                        <button className="nb-btn" onClick={this.props.onOpenDebugModal} title="Debug">
                            <IconBug />
                            <span>Debug</span>
                        </button>

                        {/* MENU — déplacé à droite */}
                        <div
                            style={{ position: 'relative' }}
                            tabIndex={-1}
                            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) this.closeHamburger(); }}
                        >
                            <button
                                onClick={this.toggleHamburger}
                                className={`nb-btn ${this.state.hamburgerOpen ? 'nb-btn-open' : ''}`}
                            >
                                {this.state.hamburgerOpen ? <IconX /> : <IconMenu />}
                                <span>Menu</span>
                            </button>

                            {this.state.hamburgerOpen && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, zIndex: 1000,
                                    background: 'rgba(8,15,45,0.92)',
                                    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(108,190,255,0.2)', borderRadius: '14px',
                                    padding: '8px', minWidth: '220px',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}>
                                    {(this.props.canChangeTheme || this.props.canChangeLanguage) && (
                                        <div>
                                            <div className="nb-section-label">⚙️ Paramètres</div>
                                            <SettingsMenu
                                                canChangeLanguage={this.props.canChangeLanguage}
                                                canChangeTheme={this.props.canChangeTheme}
                                                isRtl={this.props.isRtl}
                                                onRequestClose={this.props.onRequestCloseSettings}
                                                onRequestOpen={this.props.onClickSettings}
                                                settingsMenuOpen={this.props.settingsMenuOpen}
                                            />
                                            <div className="nb-divider" />
                                        </div>
                                    )}
                                    <div className="nb-section-label">📁 Fichier</div>
                                    <button className="nb-menu-item" onClick={() => { this.handleClickNew(); this.closeHamburger(); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        Nouveau projet
                                    </button>
                                    {this.props.canSave && (
                                        <button className="nb-menu-item" onClick={() => { this.handleClickSave(); this.closeHamburger(); }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                                            Sauvegarder
                                        </button>
                                    )}
                                    <button className="nb-menu-item" onClick={() => { this.props.onStartSelectingFileUpload(); this.closeHamburger(); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                        Charger un fichier
                                    </button>
                                    <SB3Downloader>{(className, downloadProjectCallback) => (
                                        <button className="nb-menu-item" onClick={() => { this.getSaveToComputerHandler(downloadProjectCallback)(); this.closeHamburger(); }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                            Télécharger
                                        </button>
                                    )}</SB3Downloader>
                                    <div className="nb-divider" />
                                    <div className="nb-section-label">✏️ Modifier</div>
                                    <DeletionRestorer>{(handleRestore, { restorable, deletedItem }) => (
                                        <button className="nb-menu-item" style={{ opacity: restorable ? 1 : 0.4 }}
                                            onClick={() => { if (restorable) { this.handleRestoreOption(handleRestore)(); this.closeHamburger(); } }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.96" /></svg>
                                            {this.restoreOptionMessage(deletedItem)}
                                        </button>
                                    )}</DeletionRestorer>
                                    <TurboMode>{(toggleTurboMode, { turboMode }) => (
                                        <button className="nb-menu-item" onClick={() => { toggleTurboMode(); this.closeHamburger(); }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                            {turboMode ? 'Désactiver Turbo' : 'Activer Turbo ⚡'}
                                        </button>
                                    )}</TurboMode>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className={styles.accountInfoGroup}>
                    <div className={styles.menuBarItem}>
                        {this.props.canSave && (<SaveStatus />)}
                    </div>
                </div>

                {aboutButton}
            </Box>
        );
    }
}

MenuBar.propTypes = {
    aboutMenuOpen: PropTypes.bool,
    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    confirmReadyToReplaceProject: PropTypes.func,
    currentLocale: PropTypes.string.isRequired,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isTotallyNormal: PropTypes.bool,
    isUpdating: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    loginMenuOpen: PropTypes.bool,
    logo: PropTypes.string,
    mode1920: PropTypes.bool,
    mode1990: PropTypes.bool,
    mode2020: PropTypes.bool,
    mode220022BC: PropTypes.bool,
    modeMenuOpen: PropTypes.bool,
    modeNow: PropTypes.bool,
    onClickAbout: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                onClick: PropTypes.func
            })
        )
    ]),
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickMode: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onClickSettings: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onOpenDebugModal: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onRequestCloseAbout: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onRequestCloseMode: PropTypes.func,
    onRequestCloseSettings: PropTypes.func,
    onRequestOpenAbout: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onSetTimeTravelMode: PropTypes.func,
    onShare: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    projectTitle: PropTypes.string,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    settingsMenuOpen: PropTypes.bool,
    shouldSaveBeforeTransition: PropTypes.func,
    showComingSoon: PropTypes.bool,
    username: PropTypes.string,
    userOwnsProject: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

MenuBar.defaultProps = {
    logo: scratchLogo,
    onShare: () => { }
};

const mapStateToProps = (state, ownProps) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user = state.session && state.session.session && state.session.session.user;
    return {
        aboutMenuOpen: aboutMenuOpen(state),
        accountMenuOpen: accountMenuOpen(state),
        currentLocale: state.locales.locale,
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        modeMenuOpen: modeMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        sessionExists: state.session && typeof state.session.session !== 'undefined',
        settingsMenuOpen: settingsMenuOpen(state),
        username: user ? user.username : null,
        userOwnsProject: ownProps.authorUsername && user &&
            (ownProps.authorUsername === user.username),
        vm: state.scratchGui.vm,
        mode220022BC: isTimeTravel220022BC(state),
        mode1920: isTimeTravel1920(state),
        mode1990: isTimeTravel1990(state),
        mode2020: isTimeTravel2020(state),
        modeNow: isTimeTravelNow(state)
    };
};

const mapDispatchToProps = dispatch => ({
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onOpenDebugModal: () => dispatch(openDebugModal()),
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onClickMode: () => dispatch(openModeMenu()),
    onRequestCloseMode: () => dispatch(closeModeMenu()),
    onRequestOpenAbout: () => dispatch(openAboutMenu()),
    onRequestCloseAbout: () => dispatch(closeAboutMenu()),
    onClickSettings: () => dispatch(openSettingsMenu()),
    onRequestCloseSettings: () => dispatch(closeSettingsMenu()),
    onClickNew: needSave => dispatch(requestNewProject(needSave)),
    onClickRemix: () => dispatch(remixProject()),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
    onSetTimeTravelMode: mode => dispatch(setTimeTravel(mode))
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MenuBar);