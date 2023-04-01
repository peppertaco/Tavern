export {
    collapseNewlines,
    collapse_newlines,
    force_pygmalion_formatting,
    pin_examples,
    disable_description_formatting,
    disable_scenario_formatting,
    disable_personality_formatting,
    always_force_name2,
    custom_chat_separator,
    fast_ui_mode,
    multigen,
};

let collapse_newlines = false;
let force_pygmalion_formatting = false;
let pin_examples = false;
let disable_description_formatting = false;
let disable_scenario_formatting = false;
let disable_personality_formatting = false;
let always_force_name2 = false;
let fast_ui_mode = false;
let multigen = false;
let avatar_style = 0;
let custom_chat_separator = '';

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
    fast_ui_mode = localStorage.getItem(storage_keys.fast_ui_mode) == "true";
    if (fast_ui_mode) {
        $("body").addClass("no-blur");
    }
    else {
        $("body").removeClass("no-blur");
    }
}

function applyAvatarStyle() {
    avatar_style = Number(localStorage.getItem(storage_keys.avatar_style) ?? 0);
    switch (avatar_style) {
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

function loadPowerUserSettings() {
    collapse_newlines = localStorage.getItem(storage_keys.collapse_newlines) == "true";
    force_pygmalion_formatting = localStorage.getItem(storage_keys.force_pygmalion_formatting) == "true";
    pin_examples = localStorage.getItem(storage_keys.pin_examples) == "true";
    disable_description_formatting = localStorage.getItem(storage_keys.disable_description_formatting) == "true";
    disable_scenario_formatting = localStorage.getItem(storage_keys.disable_scenario_formatting) == "true";
    disable_personality_formatting = localStorage.getItem(storage_keys.disable_personality_formatting) == "true";
    always_force_name2 = localStorage.getItem(storage_keys.always_force_name2) == "true";
    custom_chat_separator = localStorage.getItem(storage_keys.custom_chat_separator);
    fast_ui_mode = localStorage.getItem(storage_keys.fast_ui_mode) == "true";
    multigen = localStorage.getItem(storage_keys.multigen) == "true";
    avatar_style = Number(localStorage.getItem(storage_keys.avatar_style) ?? 0);

    $("#force-pygmalion-formatting-checkbox").prop("checked", force_pygmalion_formatting);
    $("#collapse-newlines-checkbox").prop("checked", collapse_newlines);
    $("#pin-examples-checkbox").prop("checked", pin_examples);
    $("#disable-description-formatting-checkbox").prop("checked", disable_description_formatting);
    $("#disable-scenario-formatting-checkbox").prop("checked", disable_scenario_formatting);
    $("#disable-personality-formatting-checkbox").prop("checked", disable_personality_formatting);
    $("#always-force-name2-checkbox").prop("checked", always_force_name2);
    $("#custom_chat_separator").val(custom_chat_separator);
    $("#fast_ui_mode").prop("checked", fast_ui_mode);
    $("#multigen").prop("checked", multigen);
    $(`input[name="avatar_style"][value="${avatar_style}"]`).prop("checked", true);
}

$(document).ready(() => {
    // Auto-load from local storage
    loadPowerUserSettings();

    $("#collapse-newlines-checkbox").change(function () {
        collapse_newlines = !!$(this).prop("checked");
        localStorage.setItem(storage_keys.collapse_newlines, collapse_newlines);
    });

    $("#force-pygmalion-formatting-checkbox").change(function () {
        force_pygmalion_formatting = !!$(this).prop("checked");
        localStorage.setItem(storage_keys.force_pygmalion_formatting, force_pygmalion_formatting);
    });

    $("#pin-examples-checkbox").change(function () {
        pin_examples = !!$(this).prop("checked");
        localStorage.setItem(storage_keys.pin_examples, pin_examples);
    });

    $("#disable-description-formatting-checkbox").change(function () {
        disable_description_formatting = !!$(this).prop('checked');
        localStorage.setItem(storage_keys.disable_description_formatting, disable_description_formatting);
    })

    $("#disable-scenario-formatting-checkbox").change(function () {
        disable_scenario_formatting = !!$(this).prop('checked');
        localStorage.setItem(storage_keys.disable_scenario_formatting, disable_scenario_formatting);
    });

    $("#disable-personality-formatting-checkbox").change(function () {
        disable_personality_formatting = !!$(this).prop('checked');
        localStorage.setItem(storage_keys.disable_personality_formatting, disable_personality_formatting);
    });

    $("#always-force-name2-checkbox").change(function () {
        always_force_name2 = !!$(this).prop("checked");
        localStorage.setItem(storage_keys.always_force_name2, always_force_name2);
    });

    $("#custom_chat_separator").on('input', function() {
        custom_chat_separator = $(this).val();
        localStorage.setItem(storage_keys.custom_chat_separator, custom_chat_separator);
    });

    $("#fast_ui_mode").change(function () {
        fast_ui_mode = $(this).prop("checked");
        localStorage.setItem(storage_keys.fast_ui_mode, fast_ui_mode);
        switchUiMode();
    });

    $("#multigen").change(function () {
        multigen = $(this).prop("checked");
        localStorage.setItem(storage_keys.multigen, multigen);
    });

    $(`input[name="avatar_style"]`).on('input', function (e) {
        avatar_style = Number(e.target.value);
        localStorage.setItem(storage_keys.avatar_style, avatar_style);
        applyAvatarStyle();
    });
	
$("#hide-chat-checkbox").change(function () {
  var sheld = document.getElementById("sheld");
  sheld.style.display = this.checked ? "none" : "grid";
});

function updateStyle() {
  if ($("#ui1-style-checkbox:checked").length > 0) {
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
  
  if ($("#ui2-style-checkbox:checked").length > 0) {
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
