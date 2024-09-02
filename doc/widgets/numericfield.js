var field = new photonui.NumericField({
    placeholder: "placeholder",
    decimalDigits: 2,
    min: -10, max: 10,
    step: 0.5,           // When scrolling over the field
    decimalSymbol: ".",  // "." or ","
    value: 5.5
});

photonui.domInsert(field, "demo");
