var win = new photonui.Window({
    title: "Widgets Demo",
    visible: true,
    padding: 10,
    width: 1000,
    height: 750,
    verticalChildExpansion: true,
    child: new photonui.GridLayout({
        verticalSpacing: 10,
        horizontalSpacing: 10,
        children: [
            new photonui.TabLayout({
                layoutOptions: {
                    x: 0,
                    y: 0,
                    width: 500,
                    height: 400
                },
                children: [
                    new photonui.TabItem({
                        title: "Fields",
                        child: new photonui.GridLayout({
                            children: [
                                // TextField
                                new photonui.Label({
                                    text: "Text field:",
                                    forInputName: "textfield-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 0
                                    }
                                }),
                                new photonui.TextField({
                                    name: "textfield-1",
                                    value: "Some text",
                                    layoutOptions: {
                                        x: 1,
                                        y: 0
                                    }
                                }),
                                new photonui.TextField({
                                    name: "textfield-2",
                                    enabled: false,
                                    value: "Some text",
                                    layoutOptions: {
                                        x: 2,
                                        y: 0
                                    }
                                }),
                                new photonui.TextField({
                                    name: "textfield-3",
                                    placeholder: "placeholder",
                                    layoutOptions: {
                                        x: 3,
                                        y: 0
                                    }
                                }),

                                // TextField.type = password
                                new photonui.Label({
                                    text: "Password field:",
                                    forInputName: "passwordfield-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 1
                                    }
                                }),
                                new photonui.TextField({
                                    name: "passwordfield-1",
                                    type: "password",
                                    value: "passw0rd",
                                    layoutOptions: {
                                        x: 1,
                                        y: 1
                                    }
                                }),
                                new photonui.TextField({
                                    name: "passwordfield-2",
                                    enabled: false,
                                    type: "password",
                                    value: "passw0rd",
                                    layoutOptions: {
                                        x: 2,
                                        y: 1
                                    }
                                }),
                                new photonui.TextField({
                                    name: "passwordfield-3",
                                    type: "password",
                                    placeholder: "placeholder",
                                    layoutOptions: {
                                        x: 3,
                                        y: 1
                                    }
                                }),

                                // NumericField
                                new photonui.Label({
                                    text: "Numeric field:",
                                    forInputName: "numericfield-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 2
                                    }
                                }),
                                new photonui.NumericField({
                                    name: "numericfield-1",
                                    value: -42,
                                    decimalDigits: 2,
                                    step: 2,
                                    layoutOptions: {
                                        x: 1,
                                        y: 2
                                    }
                                }),
                                new photonui.NumericField({
                                    name: "numericfield-2",
                                    enabled: false,
                                    value: 0.45,
                                    decimalDigits: 2,
                                    step: 0.05,
                                    layoutOptions: {
                                        x: 2,
                                        y: 2
                                    }
                                }),
                                new photonui.NumericField({
                                    name: "numericfield-3",
                                    placeholder: "placeholder",
                                    layoutOptions: {
                                        x: 3,
                                        y: 2
                                    }
                                }),

                                // TextAreaField
                                new photonui.Label({
                                    text: "Text area field:",
                                    forInputName: "textareafield-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 3
                                    }
                                }),
                                new photonui.TextAreaField({
                                    name: "textareafield-1",
                                    value: "Some long... \ntext",
                                    layoutOptions: {
                                        x: 1,
                                        y: 3
                                    }
                                }),
                                new photonui.TextAreaField({
                                    name: "textareafield-2",
                                    enabled: false,
                                    value: "Some long... \ntext",
                                    layoutOptions: {
                                        x: 2,
                                        y: 3
                                    }
                                }),
                                new photonui.TextAreaField({
                                    name: "textareafield-3",
                                    placeholder: "placeholder",
                                    layoutOptions: {
                                        x: 3,
                                        y: 3
                                    }
                                }),

                                // Slider
                                new photonui.Label({
                                    text: "Slider:",
                                    forInputName: "slider-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 4
                                    }
                                }),
                                new photonui.Slider({
                                    name: "slider-1",
                                    min: 0,
                                    max: 100,
                                    value: 33,
                                    layoutOptions: {
                                        x: 1,
                                        y: 4,
                                        cols: 2
                                    }
                                }),
                                new photonui.Slider({
                                    name: "slider-2",
                                    min: 0,
                                    max: 100,
                                    value: 33,
                                    fieldVisible: false,
                                    layoutOptions: {
                                        x: 3,
                                        y: 4,
                                    }
                                }),
                                new photonui.Slider({
                                    name: "slider-3",
                                    min: 0,
                                    max: 100,
                                    value: 66,
                                    layoutOptions: {
                                        x: 1,
                                        y: 5,
                                        cols: 2
                                    }
                                }),
                                new photonui.Slider({
                                    name: "slider-4",
                                    min: 0,
                                    max: 100,
                                    value: 66,
                                    fieldVisible: false,
                                    layoutOptions: {
                                        x: 3,
                                        y: 5,
                                    }
                                }),

                                new photonui.Label({
                                    text: "Select:",
                                    forInputName: "select-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 6
                                    }
                                }),
                                new photonui.Select({
                                    name: "select-1",
                                    value: "item1",
                                    children: [
                                        new photonui.MenuItem({value: "item1", text: "Item 1"}),
                                        new photonui.MenuItem({value: "item2", text: "Item 2"}),
                                        new photonui.MenuItem({value: "item3", text: "Item 3"})
                                    ],
                                    layoutOptions: {
                                        x: 1,
                                        y: 6
                                    }
                                }),
                                new photonui.Select({
                                    name: "select-2",
                                    value: "item1",
                                    enabled: false,
                                    children: [
                                        new photonui.MenuItem({value: "item1", text: "Item 1"}),
                                        new photonui.MenuItem({value: "item2", text: "Item 2"}),
                                        new photonui.MenuItem({value: "item3", text: "Item 3"})
                                    ],
                                    layoutOptions: {
                                        x: 2,
                                        y: 6
                                    }
                                }),
                                new photonui.Select({
                                    name: "select-3",
                                    placeholder: "placeholder",
                                    iconVisible: true,
                                    children: [
                                        new photonui.MenuItem({value: "item1", text: "Item 1"}),
                                        new photonui.MenuItem({value: "item2", text: "Item 2", icon: new photonui.FAIcon("fa-gear")}),
                                        new photonui.MenuItem({value: "item3", text: "Item 3"})
                                    ],
                                    layoutOptions: {
                                        x: 3,
                                        y: 6
                                    }
                                }),

                                new photonui.Label({
                                    text: "FontSelect:",
                                    forInputName: "fontselect-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 7
                                    }
                                }),
                                new photonui.FontSelect({
                                    name: "fontselect-1",
                                    value: "Arial Black",
                                    fonts: [
                                        "Arial", "Arial Black", "Impact",
                                        "Time New Roman", "Courier New",
                                        "Helvetica", "Verdana"
                                    ],
                                    layoutOptions: {
                                        x: 1,
                                        y: 7
                                    }
                                }),
                                new photonui.FontSelect({
                                    name: "fontselect-2",
                                    value: "Verdana",
                                    fonts: [
                                        "Arial", "Arial Black", "Impact",
                                        "Time New Roman", "Courier New",
                                        "Helvetica", "Verdana"
                                    ],
                                    enabled: false,
                                    layoutOptions: {
                                        x: 2,
                                        y: 7
                                    }
                                }),
                                new photonui.FontSelect({
                                    name: "fontselect-3",
                                    placeholder: "placeholder",
                                    layoutOptions: {
                                        x: 3,
                                        y: 7
                                    }
                                })
                            ]
                        })
                    }),
                    new photonui.TabItem({
                        title: "Tab 2"
                    }),
                    new photonui.TabItem({
                        title: "Tab 3"
                    })
                ]
            }),
            new photonui.TabLayout({
                tabsPosition: "bottom",
                layoutOptions: {
                    x: 1,
                    y: 0
                },
                children: [
                    new photonui.TabItem({
                        title: "Buttons",
                        child: new photonui.GridLayout({
                            children: [
                                new photonui.Button({
                                    text: "default",
                                    layoutOptions: {
                                        x: 0,
                                        y: 0
                                    }
                                }),
                                new photonui.Button({
                                    text: "default",
                                    leftIcon: new photonui.FAIcon("fa-flask"),
                                    layoutOptions: {
                                        x: 1,
                                        y: 0
                                    }
                                }),
                                new photonui.Button({
                                    text: "default",
                                    rightIcon: new photonui.FAIcon("fa-paper-plane-o"),
                                    layoutOptions: {
                                        x: 2,
                                        y: 0
                                    }
                                }),
                                new photonui.ToggleButton({
                                    text: "default",
                                    leftIcon: new photonui.FAIcon("fa-star"),
                                    textVisible: false,
                                    value: true,
                                    layoutOptions: {
                                        x: 3,
                                        y: 0
                                    }
                                }),
                                new photonui.Button({
                                    text: "default",
                                    leftIcon: new photonui.FAIcon("fa-wrench"),
                                    appearance: "flat",
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 4,
                                        y: 0
                                    }
                                }),

                                new photonui.Button({
                                    text: "blue",
                                    buttonColor: "blue",
                                    layoutOptions: {
                                        x: 0,
                                        y: 1
                                    }
                                }),
                                new photonui.Button({
                                    text: "blue",
                                    buttonColor: "blue",
                                    leftIcon: new photonui.FAIcon("fa-flask"),
                                    layoutOptions: {
                                        x: 1,
                                        y: 1
                                    }
                                }),
                                new photonui.Button({
                                    text: "blue",
                                    buttonColor: "blue",
                                    rightIcon: new photonui.FAIcon("fa-paper-plane-o"),
                                    enabled: false,
                                    layoutOptions: {
                                        x: 2,
                                        y: 1
                                    }
                                }),
                                new photonui.ToggleButton({
                                    text: "blue",
                                    buttonColor: "blue",
                                    rightIcon: new photonui.FAIcon("fa-star"),
                                    value: true,
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 3,
                                        y: 1
                                    }
                                }),
                                new photonui.Button({
                                    text: "blue",
                                    buttonColor: "blue",
                                    leftIcon: new photonui.FAIcon("fa-wrench"),
                                    appearance: "flat",
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 4,
                                        y: 1
                                    }
                                }),

                                new photonui.Button({
                                    text: "red",
                                    buttonColor: "red",
                                    layoutOptions: {
                                        x: 0,
                                        y: 2
                                    }
                                }),
                                new photonui.Button({
                                    text: "red",
                                    buttonColor: "red",
                                    leftIcon: new photonui.FAIcon("fa-flask"),
                                    layoutOptions: {
                                        x: 1,
                                        y: 2
                                    }
                                }),
                                new photonui.Button({
                                    text: "red",
                                    buttonColor: "red",
                                    rightIcon: new photonui.FAIcon("fa-paper-plane-o"),
                                    enabled: false,
                                    layoutOptions: {
                                        x: 2,
                                        y: 2
                                    }
                                }),
                                new photonui.ToggleButton({
                                    text: "red",
                                    buttonColor: "red",
                                    rightIcon: new photonui.FAIcon("fa-star"),
                                    value: true,
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 3,
                                        y: 2
                                    }
                                }),
                                new photonui.Button({
                                    text: "red",
                                    buttonColor: "red",
                                    leftIcon: new photonui.FAIcon("fa-wrench"),
                                    appearance: "flat",
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 4,
                                        y: 2
                                    }
                                }),

                                new photonui.Button({
                                    text: "yellow",
                                    buttonColor: "yellow",
                                    layoutOptions: {
                                        x: 0,
                                        y: 3
                                    }
                                }),
                                new photonui.Button({
                                    text: "yellow",
                                    buttonColor: "yellow",
                                    leftIcon: new photonui.FAIcon("fa-flask"),
                                    layoutOptions: {
                                        x: 1,
                                        y: 3
                                    }
                                }),
                                new photonui.Button({
                                    text: "yellow",
                                    buttonColor: "yellow",
                                    rightIcon: new photonui.FAIcon("fa-paper-plane-o"),
                                    enabled: false,
                                    layoutOptions: {
                                        x: 2,
                                        y: 3
                                    }
                                }),
                                new photonui.ToggleButton({
                                    text: "yellow",
                                    buttonColor: "yellow",
                                    rightIcon: new photonui.FAIcon("fa-star"),
                                    value: true,
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 3,
                                        y: 3
                                    }
                                }),
                                new photonui.Button({
                                    text: "yellow",
                                    buttonColor: "yellow",
                                    leftIcon: new photonui.FAIcon("fa-wrench"),
                                    appearance: "flat",
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 4,
                                        y: 3
                                    }
                                }),

                                new photonui.Button({
                                    text: "green",
                                    buttonColor: "green",
                                    layoutOptions: {
                                        x: 0,
                                        y: 4
                                    }
                                }),
                                new photonui.Button({
                                    text: "green",
                                    buttonColor: "green",
                                    leftIcon: new photonui.FAIcon("fa-flask"),
                                    layoutOptions: {
                                        x: 1,
                                        y: 4
                                    }
                                }),
                                new photonui.Button({
                                    text: "green",
                                    buttonColor: "green",
                                    rightIcon: new photonui.FAIcon("fa-paper-plane-o"),
                                    enabled: false,
                                    layoutOptions: {
                                        x: 2,
                                        y: 4
                                    }
                                }),
                                new photonui.ToggleButton({
                                    text: "green",
                                    buttonColor: "green",
                                    rightIcon: new photonui.FAIcon("fa-star"),
                                    value: true,
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 3,
                                        y: 4
                                    }
                                }),
                                new photonui.Button({
                                    text: "green",
                                    buttonColor: "green",
                                    leftIcon: new photonui.FAIcon("fa-wrench"),
                                    appearance: "flat",
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 4,
                                        y: 4
                                    }
                                }),

                                new photonui.Button({
                                    text: "flat",
                                    appearance: "flat",
                                    layoutOptions: {
                                        x: 0,
                                        y: 5
                                    }
                                }),
                                new photonui.Button({
                                    text: "flat",
                                    appearance: "flat",
                                    leftIcon: new photonui.FAIcon("fa-flask"),
                                    layoutOptions: {
                                        x: 1,
                                        y: 5
                                    }
                                }),
                                new photonui.Button({
                                    text: "flat",
                                    appearance: "flat",
                                    rightIcon: new photonui.FAIcon("fa-paper-plane-o"),
                                    enabled: false,
                                    layoutOptions: {
                                        x: 2,
                                        y: 5
                                    }
                                }),
                                new photonui.ToggleButton({
                                    text: "flat",
                                    rightIcon: new photonui.FAIcon("fa-star"),
                                    value: true,
                                    textVisible: false,
                                    appearance: "flat",
                                    layoutOptions: {
                                        x: 3,
                                        y: 5
                                    }
                                }),

                                new photonui.ColorButton({
                                    value: "#4EC8DB",
                                    layoutOptions: {
                                        x: 0,
                                        y: 6
                                    }
                                }),
                                new photonui.ColorButton({
                                    value: "#4EC8DB",
                                    appearance: "flat",
                                    layoutOptions: {
                                        x: 1,
                                        y: 6
                                    }
                                }),
                                new photonui.ColorButton({
                                    value: "#4EC8DB",
                                    enabled: false,
                                    layoutOptions: {
                                        x: 2,
                                        y: 6
                                    }
                                }),
                                new photonui.ColorButton({
                                    value: "#4EC8DB",
                                    name: "clbtn",
                                    buttonColor: "red",
                                    layoutOptions: {
                                        x: 3,
                                        y: 6,
                                        cols: 2
                                    }
                                })
                            ]
                        })
                    }),
                    new photonui.TabItem({
                        title: "Tab 2",
                        child: new photonui.FluidLayout({
                            children: [
                                new photonui.IconButton({
                                    icon: new photonui.FAIcon("fa-paw")
                                }),
                                new photonui.IconButton({
                                    icon: new photonui.FAIcon("fa-paw"),
                                    width: 32,
                                    height: 32
                                }),
                                new photonui.IconButton({
                                    icon: new photonui.FAIcon("fa-paw"),
                                    width: 48,
                                    height: 48
                                })
                            ]
                        })
                    }),
                    new photonui.TabItem({
                        title: "Tab 3"
                    })
                ]
            }),
            new photonui.TabLayout({
                tabsPosition: "left",
                layoutOptions: {
                    x: 0,
                    y: 1,
                    width: 500,
                },
                children: [
                    new photonui.TabItem({
                        title: "CheckBoxes",
                        child: new photonui.GridLayout({
                            children: [
                                new photonui.Label({
                                    text: "Checkbox:",
                                    forInputName: "checkbox-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 0
                                    }
                                }),
                                new photonui.CheckBox({
                                    name: "checkbox-1",
                                    layoutOptions: {
                                        x: 1,
                                        y: 0
                                    }
                                }),
                                new photonui.CheckBox({
                                    name: "checkbox-2",
                                    value: true,
                                    layoutOptions: {
                                        x: 2,
                                        y: 0
                                    }
                                }),
                                new photonui.CheckBox({
                                    name: "checkbox-3",
                                    enabled: false,
                                    layoutOptions: {
                                        x: 1,
                                        y: 1
                                    }
                                }),
                                new photonui.CheckBox({
                                    name: "checkbox-4",
                                    enabled: false,
                                    value: true,
                                    layoutOptions: {
                                        x: 2,
                                        y: 1
                                    }
                                }),

                                new photonui.Label({
                                    text: "Switch:",
                                    forInputName: "switch-1",
                                    layoutOptions: {
                                        x: 0,
                                        y: 2
                                    }
                                }),
                                new photonui.Switch({
                                    name: "switch-1",
                                    layoutOptions: {
                                        x: 1,
                                        y: 2
                                    }
                                }),
                                new photonui.Switch({
                                    name: "switch-2",
                                    value: true,
                                    layoutOptions: {
                                        x: 2,
                                        y: 2
                                    }
                                }),
                                new photonui.Switch({
                                    name: "switch-3",
                                    enabled: false,
                                    layoutOptions: {
                                        x: 1,
                                        y: 3
                                    }
                                }),
                                new photonui.Switch({
                                    name: "switch-4",
                                    enabled: false,
                                    value: true,
                                    layoutOptions: {
                                        x: 2,
                                        y: 3
                                    }
                                })
                            ]
                        })
                    }),
                    new photonui.TabItem({
                        title: "Viewport",
                        child: new photonui.Viewport({
                            child: new photonui.BoxLayout({
                                children: [
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"}),
                                    new photonui.Button({buttonColor: "blue"})
                                ]
                            })
                        })
                    }),
                    new photonui.TabItem({
                        title: "Expander",
                        child: new photonui.BoxLayout({
                            stretchToParentHeight: false,
                            children: [
                                new photonui.Expander({
                                    title: "Initially folded",
                                    folded: true,
                                    child: new photonui.BoxLayout({
                                        children: [
                                            new photonui.Button({buttonColor: "blue"}),
                                            new photonui.Button({buttonColor: "blue"})
                                        ]
                                    })
                                }),
                                new photonui.Expander({
                                    child: new photonui.BoxLayout({
                                        horizontalSpacing: 5,
                                        verticalSpacing: 5,
                                        children: [
                                            new photonui.Button({buttonColor: "blue"}),
                                            new photonui.Button({buttonColor: "blue"})
                                        ]
                                    })
                                })
                            ]
                        })
                    })
                ]
            }),
            new photonui.TabLayout({
                tabsPosition: "right",
                layoutOptions: {
                    x: 1,
                    y: 1
                },
                children: [
                    new photonui.TabItem({
                        title: "ProgressBar",
                        child: new photonui.GridLayout({
                            children: [
                                new photonui.ProgressBar({
                                    value: 0,
                                    layoutOptions: {
                                        x: 0,
                                        y: 0
                                    }
                                }),
                                new photonui.ProgressBar({
                                    value: .5,
                                    layoutOptions: {
                                        x: 0,
                                        y: 1
                                    }
                                }),
                                new photonui.ProgressBar({
                                    value: 1,
                                    layoutOptions: {
                                        x: 0,
                                        y: 2
                                    }
                                }),

                                new photonui.ProgressBar({
                                    value: 0,
                                    orientation: "vertical",
                                    layoutOptions: {
                                        x: 1,
                                        y: 0,
                                        rows: 3,
                                        width: 30
                                    }
                                }),
                                new photonui.ProgressBar({
                                    value: .5,
                                    orientation: "vertical",
                                    layoutOptions: {
                                        x: 2,
                                        y: 0,
                                        rows: 3,
                                        width: 30
                                    }
                                }),
                                new photonui.ProgressBar({
                                    value: 1,
                                    orientation: "vertical",
                                    layoutOptions: {
                                        x: 3,
                                        y: 0,
                                        rows: 3,
                                        width: 30
                                    }
                                }),

                                new photonui.ProgressBar({
                                    value: .33,
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 1,
                                        y: 3,
                                        cols: 3
                                    }
                                }),
                                new photonui.ProgressBar({
                                    value: .66,
                                    textVisible: false,
                                    layoutOptions: {
                                        x: 1,
                                        y: 4,
                                        cols: 3
                                    }
                                }),
                                new photonui.ProgressBar({
                                    value: .5,
                                    layoutOptions: {
                                        x: 0,
                                        y: 3,
                                        rows: 2,
                                    }
                                })
                            ]
                        })
                    }),
                    new photonui.TabItem({
                        title: "ProgressBar (anim)",
                        child: new photonui.GridLayout({
                            children: [
                                new photonui.ProgressBar({
                                    value: 0,
                                    layoutOptions: {
                                        x: 0,
                                        y: 0
                                    }
                                }),
                                new photonui.ProgressBar({
                                    value: .5,
                                    layoutOptions: {
                                        x: 0,
                                        y: 1
                                    }
                                }),
                                new photonui.ProgressBar({
                                    value: 1,
                                    layoutOptions: {
                                        x: 0,
                                        y: 2
                                    }
                                }),
                                new photonui.ProgressBar({
                                    pulsate: true,
                                    layoutOptions: {
                                        x: 0,
                                        y: 3
                                    }
                                }),
                                new photonui.ProgressBar({
                                    pulsate: true,
                                    orientation: "vertical",
                                    layoutOptions: {
                                        x: 1,
                                        y: 0,
                                        rows: 4,
                                        width: 30
                                    }
                                })
                            ]
                        })
                    }),
                    new photonui.TabItem({
                        title: "Tab 3"
                    })
                ]
            })
        ]
    })
});


var win2 = new photonui.Window({
    visible: true,
    padding: 10,
    title: "Menu",
    x: 10,
    y: 370,
    child: new photonui.Menu({
        //iconVisible: false,
        children: [
            new photonui.MenuItem({
                text: "Item 1",
                icon: new photonui.FAIcon("fa-cloud")
            }),
            new photonui.MenuItem({
                text: "Item 2",
                icon: new photonui.FAIcon("fa-cog")
            }),
            new photonui.MenuItem({
                text: "Item 3"
            }),
            new photonui.SubMenuItem({
                text: "Item 4",
                icon: new photonui.FAIcon("fa-wrench"),
                menuName: "menu-2",
            }),
            new photonui.Menu({
                name: "menu-2",
                children: [
                    new photonui.MenuItem({
                        text: "Sub Menu Item 1",
                        icon: new photonui.FAIcon("fa-paw")
                    }),
                    new photonui.MenuItem({
                        text: "Sub Menu Item 2",
                        icon: new photonui.FAIcon("fa-gears")
                    }),
                ]
            }),
            new photonui.MenuItem({
                text: "Item 5",
                icon: new photonui.FAIcon("fa-paper-plane-o")
            })
        ]
    })
});


new photonui.ColorPickerDialog({
    x: 10,
    y: 10,
    visible: true
});


win.center();
win.show();
