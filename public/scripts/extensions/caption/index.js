import { getBase64Async } from "../../utils.js";
import { getContext, getApiUrl } from "../../extensions.js";
export { MODULE_NAME };

const MODULE_NAME = 'caption';
const UPDATE_INTERVAL = 1000;

async function moduleWorker() {
    const context = getContext();

    context.onlineStatus === 'no_connection'
        ? $('#send_picture').hide(200)
        : $('#send_picture').show(200);
}

async function setImageIcon() {
    try {
        const sendButton = document.getElementById('send_picture');
        sendButton.classList.add('fa-image');
        sendButton.classList.remove('fa-hourglass-half', 'fa-fade');
    }
    catch (error) {
        console.log(error);
    }
}

async function setSpinnerIcon() {
    try {
        const sendButton = document.getElementById('send_picture');
        sendButton.classList.remove('fa-image');
        sendButton.classList.add('fa-hourglass-half', 'fa-fade');
    }
    catch (error) {
        console.log(error);
    }
}

async function sendCaptionedMessage(caption, image) {
    const context = getContext();
    const messageText = `[${context.name1} sends ${context.name2 ?? ''} a picture that contains: ${caption}]`;
    const message = {
        name: context.name1,
        is_user: true,
        is_name: true,
        send_date: Date.now(),
        mes: messageText,
        extra: { image: image },
        title: caption
    };
    context.chat.push(message);
    context.addOneMessage(message);
    await context.generate();
}

async function onSelectImage(e) {
    setSpinnerIcon();
    const file = e.target.files[0];

    if (!file) {
        return;
    }

    try {
        const base64Img = await getBase64Async(file);
        const url = new URL(getApiUrl());
        url.pathname = '/api/caption';

        const apiResult = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Bypass-Tunnel-Reminder': 'bypass',
            },
            body: JSON.stringify({ image: base64Img.split(',')[1] })
        });

        if (apiResult.ok) {
            const data = await apiResult.json();
            const caption = data.caption;
            const imageToSave = data.thumbnail ? `data:image/jpeg;base64,${data.thumbnail}` : base64Img;
            await sendCaptionedMessage(caption, imageToSave);
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        e.target.form.reset();
        setImageIcon();
    }
}

$(document).ready(function () {
    function addSendPictureButton() {
        const sendButton = document.createElement('div');
        sendButton.id = 'send_picture';
        sendButton.classList.add('fa-solid');
        $(sendButton).hide();
        $(sendButton).on('click', () => $('#img_file').click());
        $('#send_but_sheld').prepend(sendButton);
    }
    function addPictureSendForm() {
        const inputHtml = `<input id="img_file" type="file" accept="image/*">`;
        const imgForm = document.createElement('form');
        imgForm.id = 'img_form';
        $(imgForm).append(inputHtml);
        $(imgForm).hide();
        $('#form_sheld').append(imgForm);
        $('#img_file').on('change', onSelectImage);
    }

    addPictureSendForm();
    addSendPictureButton();
    setImageIcon();
    moduleWorker();
    setInterval(moduleWorker, UPDATE_INTERVAL);
});