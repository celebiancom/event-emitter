export default function EventEmitter() {

    /**
     * All channels
     * @type {Object.<string, {name: string, callback: Function}[]>}
     */
    let channels = {};

    /**
     * Subscribe to a channel with a callback which will be called each time emit method is called with respective
     * channel name that you've subscribed to.
     *
     * @param name {string} Treat as id, used for reference for unsubscribing. If chosen name isn't unique,
     *                      calls to unsubscribe method will remove all callbacks with matching name.
     * @param channel {string} Channel to subscribe to
     * @param callback {Function} Function to call when
     */
    this.subscribe = (name, channel, callback) => {
        const record = {name: name, callback: callback};
        if(channels[channel] === undefined){
            channels[channel] = [record];
        } else {
            channels[channel].push(record);
        }
    }

    /**
     * Unsubscribes all listeners with matching name. In case there are more than 1 listener with a matching name, all
     * listeners are unsubscribed.
     *
     * @param name {string} Previously set name, refer to subscribe method
     * @param channel {string} Channel to unsubscribe from
     * @returns {boolean} True if any items were unsubscribed
     */
    this.unsubscribe = (name, channel) => {
        const records = channels[channel];
        if(records === undefined){
            return false;
        }

        let removed_records = 0;
        for(let i = 0; i < records.length; i++){
            if(records[i].name === name){
                records.splice(i, 1);
                removed_records++;
                i--;
            }
        }

        return removed_records > 0;
    }

    /**
     * 
     * @param channel {string} Name of the channel to emit event to
     * @param data {any} Event data of any type
     */
    this.emit = (channel, data) => {
        if(channels[channel] !== undefined){
            for(let record of channels[channel]){
                if(typeof record.callback === "function"){
                    try{
                        record.callback(data);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }

    return this;
};
