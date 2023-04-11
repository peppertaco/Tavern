import { saveSettingsDebounced, characters } from "../script.js";

export {
    loadPowerUserSettings,
    collapseNewlines,
    playMessageSound,
    sortCharactersList,
    power_user,
};

const avatar_styles = {
    ROUND: 0,
    RECTANGULAR: 1,
}

const chat_styles = {
    DEFAULT: 0,
    BUBBLES: 1,
}

const sheld_width = {
    DEFAULT: 0,
    w1000px: 1,
}

let power_user = {
    collapse_newlines: false,
    force_pygmalion_formatting: false,
    pin_examples: false,
    disable_description_formatting: false,
    disable_scenario_formatting: false,
    disable_personality_formatting: false,
    always_force_name2: false,
    multigen: false,
    custom_chat_separator: '',
    fast_ui_mode: true,
    avatar_style: avatar_styles.ROUND,
    chat_display: chat_styles.DEFAULT,
    sheld_width: sheld_width.DEFAULT,
    play_message_sound: false,
    play_sound_unfocused: true,
    sort_field: 'name',
    sort_order: 'asc',
};

const storage_keys = {
    collapse_newlines: "TavernAI_collapse_newlines",
    force_pygmalion_formatting: "TavernAI_force_pygmalion_formatting",
    pin_examples: "TavernAI_pin_examples",
    disable_description_formatting: "TavernAI_disable_description_formatting",
    disable_scenario_formatting: "TavernAI_disable_scenario_formatting",
    disable_personality_formatting: "TavernAI_disable_personality_formatting",
    always_force_name2: "TavernAI_always_force_name2",
    custom_chat_separator: "TavernAI_custom_chat_separator",
    fast_ui_mode: "TavernAI_fast_ui_mode",
    multigen: "TavernAI_multigen",
    avatar_style: "TavernAI_avatar_style",
    chat_display: "TavernAI_chat_display",
    sheld_width: "TavernAI_sheld_width"
};

//Updated at the bottom of this script document based on 'focus' and 'blur' events
let browser_has_focus = true;

function playMessageSound() {
    if (!power_user.play_message_sound) {
        return;
    }

    if (power_user.play_sound_unfocused && browser_has_focus) {
        return;
    }

    const audio = document.getElementById('audio_message_sound');
    audio.volume = 0.8;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

function collapseNewlines(x) {
    return x.replaceAll(/\n+/g, "\n");
}

function switchUiMode() {
    const fastUi = localStorage.getItem(storage_keys.fast_ui_mode);
    power_user.fast_ui_mode = fastUi === null ? true : fastUi == "true";
    $("body").toggleClass("no-blur", power_user.fast_ui_mode);
    $("#send_form").toggleClass("no-blur-sendtextarea", power_user.fast_ui_mode);
}

function applyAvatarStyle() {
    power_user.avatar_style = Number(localStorage.getItem(storage_keys.avatar_style) ?? avatar_styles.ROUND);
    $("body").toggleClass("big-avatars", power_user.avatar_style === avatar_styles.RECTANGULAR);
}

function applyChatDisplay() {
    power_user.chat_display = Number(localStorage.getItem(storage_keys.chat_display) ?? chat_styles.DEFAULT);
    $("body").toggleClass("bubblechat", power_user.chat_display === chat_styles.BUBBLES);
}

function applySheldWidth() {
    power_user.sheld_width = Number(localStorage.getItem(storage_keys.sheld_width) ?? chat_styles.DEFAULT);
    $("body").toggleClass("w1000px", power_user.sheld_width === sheld_width.w1000px);
    let r = document.documentElement;
    if (power_user.sheld_width === 1) {
        r.style.setProperty('--sheldWidth', '1000px');
    } else {
        r.style.setProperty('--sheldWidth', '800px');
    }
}

applyAvatarStyle();
switchUiMode();
applyChatDisplay();
applySheldWidth();

// TODO delete in next release
function loadFromLocalStorage() {
    power_user.collapse_newlines = localStorage.getItem(storage_keys.collapse_newlines) == "true";
    power_user.force_pygmalion_formatting = localStorage.getItem(storage_keys.force_pygmalion_formatting) == "true";
    power_user.pin_examples = localStorage.getItem(storage_keys.pin_examples) == "true";
    power_user.disable_description_formatting = localStorage.getItem(storage_keys.disable_description_formatting) == "true";
    power_user.disable_scenario_formatting = localStorage.getItem(storage_keys.disable_scenario_formatting) == "true";
    power_user.disable_personality_formatting = localStorage.getItem(storage_keys.disable_personality_formatting) == "true";
    power_user.always_force_name2 = localStorage.getItem(storage_keys.always_force_name2) == "true";
    power_user.custom_chat_separator = localStorage.getItem(storage_keys.custom_chat_separator);
    power_user.multigen = localStorage.getItem(storage_keys.multigen) == "true";
}

function loadPowerUserSettings(settings) {
    // Migrate legacy settings
    loadFromLocalStorage();

    // Now do it properly from settings.json
    if (settings.power_user !== undefined) {
        Object.assign(power_user, settings.power_user);
    }

    // These are still local storage
    const fastUi = localStorage.getItem(storage_keys.fast_ui_mode);
    power_user.fast_ui_mode = fastUi === null ? true : fastUi == "true";
    power_user.avatar_style = Number(localStorage.getItem(storage_keys.avatar_style) ?? avatar_styles.ROUND);
    power_user.chat_display = Number(localStorage.getItem(storage_keys.chat_display) ?? chat_styles.DEFAULT);
    power_user.sheld_width = Number(localStorage.getItem(storage_keys.sheld_width) ?? sheld_width.DEFAULT);

    $("#force-pygmalion-formatting-checkbox").prop("checked", power_user.force_pygmalion_formatting);
    $("#collapse-newlines-checkbox").prop("checked", power_user.collapse_newlines);
    $("#pin-examples-checkbox").prop("checked", power_user.pin_examples);
    $("#disable-description-formatting-checkbox").prop("checked", power_user.disable_description_formatting);
    $("#disable-scenario-formatting-checkbox").prop("checked", power_user.disable_scenario_formatting);
    $("#disable-personality-formatting-checkbox").prop("checked", power_user.disable_personality_formatting);
    $("#always-force-name2-checkbox").prop("checked", power_user.always_force_name2);
    $("#custom_chat_separator").val(power_user.custom_chat_separator);
    $("#fast_ui_mode").prop("checked", power_user.fast_ui_mode);
    $("#multigen").prop("checked", power_user.multigen);
    $("#play_message_sound").prop("checked", power_user.play_message_sound);
    $("#play_sound_unfocused").prop("checked", power_user.play_sound_unfocused);
    $(`input[name="avatar_style"][value="${power_user.avatar_style}"]`).prop("checked", true);
    $(`input[name="chat_display"][value="${power_user.chat_display}"]`).prop("checked", true);
    $(`input[name="sheld_width"][value="${power_user.sheld_width}"]`).prop("checked", true);
    $(`#character_sort_order option[data-order="${power_user.sort_order}"][data-field="${power_user.sort_field}"]`).prop("selected", true);
    sortCharactersList();
}

function sortCharactersList() {
    const sortFunc = (a, b) => power_user.sort_order == 'asc' ? compareFunc(a, b) : compareFunc(b, a);
    const compareFunc = (first, second) => typeof first[power_user.sort_field] == "string"
        ? first[power_user.sort_field].localeCompare(second[power_user.sort_field])
        : first[power_user.sort_field] - second[power_user.sort_field];

    if (power_user.sort_field == undefined || characters.length === 0) {
        return;
    }

    let orderedList = characters.slice().sort(sortFunc);

    for (let i = 0; i < characters.length; i++) {
        $(`.character_select[chid="${i}"]`).css({ 'order': orderedList.indexOf(characters[i]) });
    }
}

$(document).ready(() => {
    // Settings that go to settings.json
    $("#collapse-newlines-checkbox").change(function () {
        power_user.collapse_newlines = !!$(this).prop("checked");
        saveSettingsDebounced();
    });

    $("#force-pygmalion-formatting-checkbox").change(function () {
        power_user.force_pygmalion_formatting = !!$(this).prop("checked");
        saveSettingsDebounced();
    });

    $("#pin-examples-checkbox").change(function () {
        power_user.pin_examples = !!$(this).prop("checked");
        saveSettingsDebounced();
    });

    $("#disable-description-formatting-checkbox").change(function () {
        power_user.disable_description_formatting = !!$(this).prop('checked');
        saveSettingsDebounced();
    })

    $("#disable-scenario-formatting-checkbox").change(function () {
        power_user.disable_scenario_formatting = !!$(this).prop('checked');
        saveSettingsDebounced();
    });

    $("#disable-personality-formatting-checkbox").change(function () {
        power_user.disable_personality_formatting = !!$(this).prop('checked');
        saveSettingsDebounced();
    });

    $("#always-force-name2-checkbox").change(function () {
        power_user.always_force_name2 = !!$(this).prop("checked");
        saveSettingsDebounced();
    });

    $("#custom_chat_separator").on('input', function () {
        power_user.custom_chat_separator = $(this).val();
        saveSettingsDebounced();
    });

    $("#multigen").change(function () {
        power_user.multigen = $(this).prop("checked");
        saveSettingsDebounced();
    });

    // Settings that go to local storage
    $("#fast_ui_mode").change(function () {
        power_user.fast_ui_mode = $(this).prop("checked");
        localStorage.setItem(storage_keys.fast_ui_mode, power_user.fast_ui_mode);
        switchUiMode();
    });

    $(`input[name="avatar_style"]`).on('input', function (e) {
        power_user.avatar_style = Number(e.target.value);
        localStorage.setItem(storage_keys.avatar_style, power_user.avatar_style);
        applyAvatarStyle();
    });

    $(`input[name="chat_display"]`).on('input', function (e) {
        power_user.chat_display = Number(e.target.value);
        localStorage.setItem(storage_keys.chat_display, power_user.chat_display);
        applyChatDisplay();
    });

    $(`input[name="sheld_width"]`).on('input', function (e) {
        power_user.sheld_width = Number(e.target.value);
        localStorage.setItem(storage_keys.sheld_width, power_user.sheld_width);
        console.log("sheld width changing now");
        applySheldWidth();
    });

    $("#play_message_sound").on('input', function () {
        power_user.play_message_sound = !!$(this).prop('checked');
        saveSettingsDebounced();
    });

    $("#play_sound_unfocused").on('input', function () {
        power_user.play_sound_unfocused = !!$(this).prop('checked');
        saveSettingsDebounced();
    });

    $("#character_sort_order").on('change', function () {
        power_user.sort_field = $(this).find(":selected").data('field');
        power_user.sort_order = $(this).find(":selected").data('order');
        sortCharactersList();
        saveSettingsDebounced();
    });

    $(window).on('focus', function() {
        browser_has_focus = true;
    });

    $(window).on('blur', function() {
        browser_has_focus = false;
    });

    $("#hide-chat-checkbox").change(function () {
      var sheld = document.getElementById("sheld");
      sheld.style.display = this.checked ? "none" : "grid";
    });	
	
$(document).ready(function() {
    $("#ui0-style-checkbox").change(function () {
      if (this.checked) {
        $(".expression-holder").css("left", "0");
    	$(".expression-holder").css("max-width", "calc((100vw - 800px)/2)");
	    $(".expression-holder").css("height", "auto"); 			
        $("#sheld").css("height", "calc(100svh - 50px)");
    	$("#sheld").css("max-width", "var(--sheldWidth)");
    	$("#sheld").css("top", "41px");
    	$("#sheld").css("bottom", "0");
		$("#sheld").css("left", "0");
	    $("img.expression").css("max-width", "100%");  
    	$("img.expression").css("height", "none"); 	
	  }
    });		
	
    $("#ui1-style-checkbox").change(function () {
      if (this.checked) {
    	$(".expression-holder").css("max-width", "100%");  
        $(".expression-holder").css("left", "-20%");
    	$(".expression-holder").css("height", "100%"); 		
    	$("img.expression").css("max-width", "100%");  
    	$("img.expression").css("height", "200%"); 
        $("#sheld").css("left", "40%");
    	$("#sheld").css("width", "45%");
      } else {
        $(".expression-holder").css("left", "auto");
    	$(".expression-holder").css("max-width", "calc((100vw - 800px)/2)");
	    $(".expression-holder").css("height", "auto"); 		
        $("#sheld").css("left", "0");
    	$("#sheld").css("max-width", "50%");
    	$("img.expression").css("max-width", "100%");  
	    $("img.expression").css("height", "none"); 	
      }
    });	
	
    $("#ui2-style-checkbox").change(function () {
      if (this.checked) {
        $(".expression-holder").css("left", "auto");
    	$(".expression-holder").css("max-width", "100%"); 
    	$(".expression-holder").css("height", "100%"); 	
	    $("img.expression").css("max-width", "100%");  
	    $("img.expression").css("height", "200%"); 
    	$("#sheld").css("top", "65%");		
        $("#sheld").css("height", "calc(100svh - 65svh)");
   	    $("#sheld").css("max-width", "80%");
		$("#sheld").css("width", "100%");
      } else {
        $(".expression-holder").css("left", "0");
    	$(".expression-holder").css("max-width", "calc((100vw - 800px)/2)");
	    $(".expression-holder").css("height", "auto"); 			
        $("#sheld").css("height", "calc(100svh - 42px)");
    	$("#sheld").css("max-width", "50%");
    	$("#sheld").css("top", "35px");
    	$("#sheld").css("bottom", "0");
	    $("img.expression").css("max-width", "100%");  
    	$("img.expression").css("height", "none"); 	
      }
    });

    $("#ui3-style-checkbox").change(function () {
      if (this.checked) {
        $(".expression-holder").css("left", "auto");
    	$(".expression-holder").css("max-width", "100%"); 
    	$(".expression-holder").css("height", "100%"); 	
    	$(".expression-holder").css("max-height", "100%"); 	
    	$(".expression-holder").css("top", "10%"); 		
    	$("img.expression").css("max-width", "100%");  
    	$("img.expression").css("height", "100%"); 
    	$("img.expression").css("object-fit", "cover"); 	
        $("#sheld").css("height", "calc(100svh - 60svh)");
    	$("#sheld").css("max-width", "100%");
    	$("#sheld").css("top", "60%");
      } else {
        $(".expression-holder").css("left", "0");
    	$(".expression-holder").css("max-width", "calc((100vw - 800px)/2)");
    	$(".expression-holder").css("height", "auto"); 			
        $("#sheld").css("height", "calc(100svh - 42px)");
    	$("#sheld").css("max-width", "100%");
   	    $("#sheld").css("top", "35px");
    	$("#sheld").css("bottom", "0");
    	$("img.expression").css("max-width", "100%");  
    	$("img.expression").css("height", "none"); 	
      }
    });	
});
});