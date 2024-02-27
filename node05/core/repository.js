//Base repository
module.exports = class {
    model
    constructor(model) {
        this.model = this.getModel();
    }
    create(data = {}) {
        create(data = {}){
            return this.model.create(data);
        }
        findOne(attributes = {}){}
        findByPk(id){}
        update(data = {}, condition = {}){}
    }
}