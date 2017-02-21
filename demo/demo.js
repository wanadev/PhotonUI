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
    visible: true,
    color: new photonui.Color("green")
});

var listView = new photonui.ListView({
  items: [
    "hello world foo bar",
    "hello",
    "world",
    "foo",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    "bar",
  ]
});

new photonui.Window({
  visible: true,
  child: listView,
});

var tableView = new photonui.TableView({
  columns: [
    "id",
    123,
    {
      label: "First Name",
      value: "name.first",
    },
    {
      label: "Last Name",
      value: "name.last"
    },
    {
      label: "Email",
      value: "email"
    },
    {
      label: "Gender",
      value: function(item) {
        return item.gender;
      }
    },
    {
      label: "Delete",
      value: function(item) {
        return new photonui.CheckBox({
            name: "checkbox-" + item.id,
        });
      }
    },
  ],
  items: [{
    "id": 1,
    "name": {
      "first": "Shawn",
      "last": "Mcdonald"
    },
    "email": "smcdonald0@blogger.com",
    "gender": "Male",
    "ip_address": "121.184.51.179"
  }, {
    "id": 2,
    "name": {
      "first": "Robert",
      "last": "Daniels"
    },
    // "email": "rdaniels1@imdb.com",
    // "gender": "Male",
    "ip_address": "95.11.103.93"
  }, {
    "id": 3,
    "name": {
      "first": "Nicholas",
      // "last": "Pierce"
    },
    "email": "npierce2@hostgator.com",
    "gender": "Male",
    "ip_address": "156.173.60.111"
  }, {
    "id": 4,
    "name": {
      "first": "Maria",
      "last": "Franklin"
    },
    "email": "mfranklin3@deviantart.com",
    "gender": "Female",
    "ip_address": "233.79.32.166"
  }, {
    "id": 5,
    "name": {
      "first": "Randy",
      "last": "Martinez"
    },
    "email": "rmartinez4@nps.gov",
    "gender": "Male",
    "ip_address": "178.225.129.73"
  }, {
    "id": 6,
    "name": {
      "first": "Eugene",
      "last": "Henry"
    },
    "email": "ehenry5@ebay.co.uk",
    "gender": "Male",
    "ip_address": "11.91.84.127"
  }, {
    "id": 7,
    "name": {
      "first": "Annie",
      "last": "Howard"
    },
    "email": "ahoward6@github.io",
    "gender": "Female",
    "ip_address": "157.35.153.132"
  }, {
    "id": 8,
    "name": {
      "first": "Benjamin",
      "last": "Jacobs"
    },
    "email": "bjacobs7@hp.com",
    "gender": "Male",
    "ip_address": "68.99.151.64"
  }, {
    "id": 9,
    "name": {
      "first": "Phillip",
      "last": "Rose"
    },
    "email": "prose8@desdev.cn",
    "gender": "Male",
    "ip_address": "175.115.73.141"
  }, {
    "id": 10,
    "name": {
      "first": "Dorothy",
      "last": "Butler"
    },
    "email": "dbutler9@parallels.com",
    "gender": "Female",
    "ip_address": "250.226.132.216"
  }, {
    "id": 11,
    "name": {
      "first": "Evelyn",
      "last": "Jenkins"
    },
    "email": "ejenkinsa@globo.com",
    "gender": "Female",
    "ip_address": "166.180.44.229"
  }, {
    "id": 12,
    "name": {
      "first": "Paul",
      "last": "Moore"
    },
    "email": "pmooreb@newyorker.com",
    "gender": "Male",
    "ip_address": "85.192.230.49"
  }, {
    "id": 13,
    "name": {
      "first": "Nicole",
      "last": "Morgan"
    },
    "email": "nmorganc@1688.com",
    "gender": "Female",
    "ip_address": "63.1.164.210"
  }, {
    "id": 14,
    "name": {
      "first": "Willie",
      "last": "Dean"
    },
    "email": "wdeand@icq.com",
    "gender": "Male",
    "ip_address": "156.247.20.65"
  }, {
    "id": 15,
    "name": {
      "first": "Maria",
      "last": "Ferguson"
    },
    "email": "mfergusone@webnode.com",
    "gender": "Female",
    "ip_address": "155.192.193.147"
  }, {
    "id": 16,
    "name": {
      "first": "Carl",
      "last": "Griffin"
    },
    "email": "cgriffinf@themeforest.net",
    "gender": "Male",
    "ip_address": "1.184.58.82"
  }, {
    "id": 17,
    "name": {
      "first": "Walter",
      "last": "Wilson"
    },
    "email": "wwilsong@engadget.com",
    "gender": "Male",
    "ip_address": "246.72.89.52"
  }, {
    "id": 18,
    "name": {
      "first": "Kenneth",
      "last": "Rivera"
    },
    "email": "kriverah@cafepress.com",
    "gender": "Male",
    "ip_address": "101.162.228.116"
  }, {
    "id": 19,
    "name": {
      "first": "Judith",
      "last": "Kennedy"
    },
    "email": "jkennedyi@webmd.com",
    "gender": "Female",
    "ip_address": "196.86.67.107"
  }, {
    "id": 20,
    "name": {
      "first": "Emily",
      "last": "Larson"
    },
    "email": "elarsonj@liveinternet.ru",
    "gender": "Female",
    "ip_address": "84.110.70.45"
  }, {
    "id": 21,
    "name": {
      "first": "Evelyn",
      "last": "Cole"
    },
    "email": "ecolek@themeforest.net",
    "gender": "Female",
    "ip_address": "90.48.94.146"
  }, {
    "id": 22,
    "name": {
      "first": "Barbara",
      "last": "King"
    },
    "email": "bkingl@globo.com",
    "gender": "Female",
    "ip_address": "177.177.3.179"
  }, {
    "id": 23,
    "name": {
      "first": "Patrick",
      "last": "Duncan"
    },
    "email": "pduncanm@cnbc.com",
    "gender": "Male",
    "ip_address": "75.128.90.204"
  }, {
    "id": 24,
    "name": {
      "first": "Martin",
      "last": "Daniels"
    },
    "email": "mdanielsn@nymag.com",
    "gender": "Male",
    "ip_address": "220.163.207.156"
  }, {
    "id": 25,
    "name": {
      "first": "Frank",
      "last": "Wheeler"
    },
    "email": "fwheelero@amazon.de",
    "gender": "Male",
    "ip_address": "209.89.24.139"
  }, {
    "id": 26,
    "name": {
      "first": "Jennifer",
      "last": "Ellis"
    },
    "email": "jellisp@feedburner.com",
    "gender": "Female",
    "ip_address": "163.80.85.104"
  }, {
    "id": 27,
    "name": {
      "first": "Andrea",
      "last": "Morrison"
    },
    "email": "amorrisonq@domainmarket.com",
    "gender": "Female",
    "ip_address": "17.111.81.191"
  }, {
    "id": 28,
    "name": {
      "first": "Susan",
      "last": "Porter"
    },
    "email": "sporterr@reuters.com",
    "gender": "Female",
    "ip_address": "96.45.20.229"
  }, {
    "id": 29,
    "name": {
      "first": "Linda",
      "last": "Fields"
    },
    "email": "lfieldss@qq.com",
    "gender": "Female",
    "ip_address": "184.45.155.69"
  }, {
    "id": 30,
    "name": {
      "first": "Terry",
      "last": "Robinson"
    },
    "email": "trobinsont@springer.com",
    "gender": "Male",
    "ip_address": "128.218.63.142"
  }, {
    "id": 31,
    "name": {
      "first": "Doris",
      "last": "Rivera"
    },
    "email": "driverau@alexa.com",
    "gender": "Female",
    "ip_address": "240.94.249.39"
  }, {
    "id": 32,
    "name": {
      "first": "Martin",
      "last": "Campbell"
    },
    "email": "mcampbellv@joomla.org",
    "gender": "Male",
    "ip_address": "78.95.255.56"
  }, {
    "id": 33,
    "name": {
      "first": "Bruce",
      "last": "Sims"
    },
    "email": "bsimsw@com.com",
    "gender": "Male",
    "ip_address": "123.158.39.250"
  }, {
    "id": 34,
    "name": {
      "first": "Frank",
      "last": "Fuller"
    },
    "email": "ffullerx@dropbox.com",
    "gender": "Male",
    "ip_address": "88.50.182.130"
  }, {
    "id": 35,
    "name": {
      "first": "John",
      "last": "Romero"
    },
    "email": "jromeroy@salon.com",
    "gender": "Male",
    "ip_address": "106.157.213.92"
  }, {
    "id": 36,
    "name": {
      "first": "Doris",
      "last": "Perez"
    },
    "email": "dperezz@furl.net",
    "gender": "Female",
    "ip_address": "203.228.122.220"
  }, {
    "id": 37,
    "name": {
      "first": "Billy",
      "last": "West"
    },
    "email": "bwest10@archive.org",
    "gender": "Male",
    "ip_address": "56.17.21.93"
  }, {
    "id": 38,
    "name": {
      "first": "Jeffrey",
      "last": "Fernandez"
    },
    "email": "jfernandez11@smugmug.com",
    "gender": "Male",
    "ip_address": "14.155.147.178"
  }, {
    "id": 39,
    "name": {
      "first": "Mark",
      "last": "Burke"
    },
    "email": "mburke12@exblog.jp",
    "gender": "Male",
    "ip_address": "226.27.93.228"
  }, {
    "id": 40,
    "name": {
      "first": "Jennifer",
      "last": "Rose"
    },
    "email": "jrose13@fema.gov",
    "gender": "Female",
    "ip_address": "232.198.205.165"
  }, {
    "id": 41,
    "name": {
      "first": "Martha",
      "last": "Brown"
    },
    "email": "mbrown14@issuu.com",
    "gender": "Female",
    "ip_address": "130.188.173.159"
  }, {
    "id": 42,
    "name": {
      "first": "Kenneth",
      "last": "Crawford"
    },
    "email": "kcrawford15@google.ca",
    "gender": "Male",
    "ip_address": "126.25.203.183"
  }, {
    "id": 43,
    "name": {
      "first": "Lori",
      "last": "Garcia"
    },
    "email": "lgarcia16@cyberchimps.com",
    "gender": "Female",
    "ip_address": "26.210.254.221"
  }, {
    "id": 44,
    "name": {
      "first": "Irene",
      "last": "Brooks"
    },
    "email": "ibrooks17@google.co.jp",
    "gender": "Female",
    "ip_address": "4.238.133.240"
  }, {
    "id": 45,
    "name": {
      "first": "Deborah",
      "last": "Thompson"
    },
    "email": "dthompson18@pcworld.com",
    "gender": "Female",
    "ip_address": "243.150.177.131"
  }, {
    "id": 46,
    "name": {
      "first": "Howard",
      "last": "Hunter"
    },
    "email": "hhunter19@nyu.edu",
    "gender": "Male",
    "ip_address": "63.121.221.227"
  }, {
    "id": 47,
    "name": {
      "first": "Carl",
      "last": "Hicks"
    },
    "email": "chicks1a@thetimes.co.uk",
    "gender": "Male",
    "ip_address": "196.133.192.123"
  }, {
    "id": 48,
    "name": {
      "first": "Christina",
      "last": "Fowler"
    },
    "email": "cfowler1b@patch.com",
    "gender": "Female",
    "ip_address": "8.41.240.253"
  }, {
    "id": 49,
    "name": {
      "first": "Thomas",
      "last": "Moreno"
    },
    "email": "tmoreno1c@webeden.co.uk",
    "gender": "Male",
    "ip_address": "247.195.142.63"
  }, {
    "id": 50,
    "name": {
      "first": "Amanda",
      "last": "Hunt"
    },
    "email": "ahunt1d@phpbb.com",
    "gender": "Female",
    "ip_address": "26.65.167.240"
  }],
});

new photonui.Window({
  visible: true,
  child: new photonui.Viewport({
    child: tableView,
  }),
  height: 400
});

new photonui.Window({
    visible: true,
    child: new photonui.BaseDataView({
        customFormater: function(item) {
          return new photonui.BoxLayout({
              orientation: "vertical",
              children: [
                  new photonui.Image({
                      url: item.image,
                      height: 96,
                      width: 96,
                  }),
                  new photonui.Text({
                      rawHtml: "<div style=\"text-align: center\">" + item.label + "</div>",
                  })
              ]
            });
        },
        items: [
            {
                label: "hello world",
                image: "http://pipsum.com/96x96.jpg?t=1",
            },
            {
                label: "hello",
                image: "http://pipsum.com/96x96.jpg?t=2",
            },
            {
                label: "world",
                image: "http://pipsum.com/96x96.jpg?t=3",
            },
            {
                label: "foo",
                image: "http://pipsum.com/96x96.jpg?t=4",
            },
            {
                label: "Lorem ipsum dolor sit amet",
                image: "http://pipsum.com/96x96.jpg?t=5",
            },
            {
                label: "bar",
                image: "http://pipsum.com/96x96.jpg?t=6",
            },
        ]
    }),
});

win.center();
win.show();
