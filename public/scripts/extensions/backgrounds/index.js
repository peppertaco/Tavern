import { getContext } from "../../extensions.js";
export { MODULE_NAME };

const MODULE_NAME = 'backgrounds';
const METADATA_KEY = 'custom_background';
const UPDATE_INTERVAL = 1000;

async function moduleWorker() {
    if (hasCustomBackground()) {
        $('#unlock_background').show();
        $('#lock_background').hide();
        setCustomBackground();
    }
    else {
        $('#unlock_background').hide();
        $('#lock_background').show();
        unsetCustomBackground();
    }
}

function onLockBackgroundClick() {
    const bgImage = window.getComputedStyle(document.getElementById('bg1')).backgroundImage;

    // Extract the URL from the CSS string
    const urlRegex = /url\((['"])?(.*?)\1\)/;
    const matches = bgImage.match(urlRegex);
    const url = matches[2];

    // Remove the protocol and host, leaving the relative URL
    const relativeUrl = new URL(url).pathname;
    const relativeBgImage = `url("${relativeUrl}")`

    saveBackgroundMetadata(relativeBgImage);
    setCustomBackground();
    $('#unlock_background').show();
    $('#lock_background').hide();
}

function onUnlockBackgroundClick() {
    removeBackgroundMetadata();
    unsetCustomBackground();
    $('#unlock_background').hide();
    $('#lock_background').show();
}

function hasCustomBackground() {
    const context = getContext();
    return !!context.chatMetadata[METADATA_KEY];
}

function saveBackgroundMetadata(file) {
    const context = getContext();
    context.chatMetadata[METADATA_KEY] = file;
    context.saveChat();
}

function removeBackgroundMetadata() {
    const context = getContext();
    delete context.chatMetadata[METADATA_KEY];
    context.saveChat();
}

function setCustomBackground() {
    const context = getContext();
    const file = context.chatMetadata[METADATA_KEY];

    // bg already set
    if (document.getElementById("bg_custom").style.backgroundImage == file) {
        return;
    }

    $("#bg_custom").css("background-image", file);
    $("#custom_bg_preview").css("background-image", file);
}

function unsetCustomBackground() {
    $("#bg_custom").css("background-image", 'none');
    $("#custom_bg_preview").css("background-image", 'none');
}

function onSelectBackgroundClick() {
    const bgfile = $(this).attr("bgfile");

    if (hasCustomBackground()) {
        saveBackgroundMetadata(`url("backgrounds/${bgfile}")`);
        setCustomBackground();
    }
}

$(document).ready(function () {
    function addSettings() {
        const html = `
        <div class="background_settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>Character Backgrounds</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content">
                    <div class="background_controls">
                        <div id="lock_background" class="menu_button">
                            <i class="fa-solid fa-lock"></i>
                            Lock
                        </div>
                        <div id="unlock_background" class="menu_button">
                            <i class="fa-solid fa-unlock"></i>
                            Unlock
                        </div>
                        <small>
                            Press "Lock" to assign a currently selected background to a character or group chat.<br>
                            Any background image selected while lock is engaged will be saved automatically.
                        </small>
                    </div>
                    <div>Preview</div>
                    <div id="custom_bg_preview">
                    </div>
                </div>
            </div>
        </div>
        `;
        $('#extensions_settings').append(html);
        $('#lock_background').on('click', onLockBackgroundClick);
        $('#unlock_background').on('click', onUnlockBackgroundClick);
        $(document).on("click", ".bg_example", onSelectBackgroundClick);
    }

    addSettings();
    setInterval(moduleWorker, UPDATE_INTERVAL);
});