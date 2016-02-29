import ViewModel from "./ViewModel";

export default class RivetsViewModel<T> extends ViewModel<T> {
    protected _rivetsBinding;

    protected render() {
        super.render();

        this._htmlRoot.innerHTML = this._context.views.getTemplate(this.viewFile).call(this, this);
        this._rivetsBinding = this._context.rivets.bind(this._htmlRoot, this);
    }

    detach() {
        super.detach();
        this._rivetsBinding.unbind();
        this._htmlRoot.innerHTML = "";
    }

    /**
     * Child classes should implement this
     * @returns A string defining the view used by the ViewModel.
     */
    get viewFile() : string {
        return "no_view_defined";
    }
}
