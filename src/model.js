class Model {

    constructor() {
        this.reset();
    }

    reset() {
        this.gameId = null;
        this.authId = null;
    }
}

export default new Model();  // singleton
