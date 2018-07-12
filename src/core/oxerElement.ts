class oxerElement {
    private constructor() {

    }

    public slot: oxerSolot;

    public static createElement(): oxerElement {
        return new oxerElement();
    }
}