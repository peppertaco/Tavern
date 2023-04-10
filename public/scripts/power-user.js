import { saveSettingsDebounced } from "../script.js";

export {
    loadPowerUserSettings,
    collapseNewlines,
    power_user,
};

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
    fast_ui_mode: false,
    avatar_style: 0,
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
};

function collapseNewlines(x) {
    return x.replaceAll(/\n+/g, "\n");
}

function switchUiMode() {
    power_user.fast_ui_mode = localStorage.getItem(storage_keys.fast_ui_mode) == "true";
    if (power_user.fast_ui_mode) {
        $("body").addClass("no-blur");
    }
    else {
        $("body").removeClass("no-blur");
    }
}

function applyAvatarStyle() {
    power_user.avatar_style = Number(localStorage.getItem(storage_keys.avatar_style) ?? 0);
    switch (power_user.avatar_style) {
        case 0:
            $("body").removeClass("big-avatars");
            break;
        case 1:
            $("body").addClass("big-avatars");
            break;
    }
}

applyAvatarStyle();
switchUiMode();

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
    power_user.fast_ui_mode = localStorage.getItem(storage_keys.fast_ui_mode) == "true";
    power_user.avatar_style = Number(localStorage.getItem(storage_keys.avatar_style) ?? 0);

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
    $(`input[name="avatar_style"][value="${power_user.avatar_style}"]`).prop("checked", true);
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

    $("#custom_chat_separator").on('input', function() {
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
	
    $("#hide-chat-checkbox").change(function () {
      var sheld = document.getElementById("sheld");
      sheld.style.display = this.checked ? "none" : "grid";
    });		
	
$("#ui1-style-checkbox").change(function () {
  if (this.checked) {
	$(".expression-holder").css("max-width", "100%");  
    $(".expression-holder").css("left", "-20%");
	$(".expression-holder").css("height", "100%"); 		
	$("img.expression").css("max-width", "100%");  
	$("img.expression").css("height", "200%"); 
    $("#sheld").css("left", "50%");
	$("#sheld").css("max-width", "40%");
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
    $("#sheld").css("height", "calc(100svh - 65svh)");
	$("#sheld").css("max-width", "80%");
	$("#sheld").css("top", "65%");
	
  } else {
    $(".expression-holder").css("left", "0");
	$(".expression-holder").css("max-width", "calc((100vw - 800px)/2)");
	$(".expression-holder").css("height", "auto"); 			
    $("#sheld").css("height", "calc(100svh - 40px)");
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
    $("#sheld").css("height", "calc(100svh - 40px)");
	$("#sheld").css("max-width", "100%");
	$("#sheld").css("top", "35px");
	$("#sheld").css("bottom", "0");
	$("img.expression").css("max-width", "100%");  
	$("img.expression").css("height", "none"); 	
  }
});	
	
});
