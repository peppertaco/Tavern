export { SileroTtsProvider }

class SileroTtsProvider {
    //########//
    // Config //
    //########//

    settings
    voices = []

    defaultSettings = {
        provider_endpoint: "http://localhost:8001/tts",
        voiceMap: {}
    }
    
    get settingsHtml() {
        let html = `
        <label for="silero_tts_endpoint">Provider Endpoint:</label>
        <input id="silero_tts_endpoint" type="text" class="text_pole" maxlength="250" value="${this.defaultSettings.provider_endpoint}"/>
        <span> A simple Python Silero TTS Server can be found <a href="https://github.com/ouoertheo/silero-api-server">here</a>.</span>
        `
        return html
    }
    
    onSettingsChange() {
        // Used when provider settings are updated from UI
        this.settings.provider_endpoint = $('#silero_tts_endpoint').val()
    }

    loadSettings(settings) {
        // Pupulate Provider UI given input settings
        if (Object.keys(settings).length == 0) {
            console.info("Using default TTS Provider settings")
        }

        // Only accept keys defined in defaultSettings
        this.settings = this.defaultSettings

        for (const key in settings){
            if (key in this.settings){
                this.settings[key] = settings[key]
            } else {
                throw `Invalid setting passed to TTS Provider: ${key}`
            }
        }
        
        $('#silero_tts_endpoint').text(this.settings.provider_endpoint)
        console.info("Settings loaded")
    }

    
    async onApplyClick() {
        return
    }

    //#################//
    //  TTS Interfaces //
    //#################//
    
    async getVoice(voiceName) {
        if (this.voices.length == 0) {
            this.voices = await this.fetchTtsVoiceIds()
        }
        const match = this.voices.filter(
            sileroVoice => sileroVoice.name == voiceName
        )[0]
        if (!match) {
            throw `TTS Voice name ${voiceName} not found`
        }
        return match
    }

    async generateTts(text, voiceId){
        const response = await this.fetchTtsGeneration(text, voiceId)
        return response
    }

    //###########//
    // API CALLS //
    //###########//
    async fetchTtsVoiceIds() {
        const response = await fetch(`${this.settings.provider_endpoint}/speakers`)
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.json()}`)
        }
        const responseJson = await response.json()
        return responseJson
    }

    async fetchTtsGeneration(inputText, voiceId) {
        console.info(`Generating new TTS for voice_id ${voiceId}`)
        const response = await fetch(
            `${this.settings.provider_endpoint}/generate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "text": inputText,
                    "speaker": voiceId
                })
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.json()}`)
        }
        return response
    }

    async fetchTtsFromHistory(history_item_id) {
        console.info(`Fetched existing TTS with history_item_id ${history_item_id}`)
        const response = await fetch(
            `https://api.elevenlabs.io/v1/history/${history_item_id}/audio`,
            {
                headers: {
                    'xi-api-key': this.API_KEY
                }
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.json()}`)
        }
        return response
    }

}
