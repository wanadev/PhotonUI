var fl = new photonui.FluidLayout({
    children: [
  new photonui.Button({
appearance: "flat",
leftIcon: new photonui.FAIcon("fa-folder-open-o"),
textVisible: false
  }),
  new photonui.Button({
appearance: "flat",
leftIcon: new photonui.FAIcon("fa-save"),
textVisible: false
  }),
  new photonui.Separator({orientation: "vertical"}),
  new photonui.ToggleButton({
appearance: "flat",
leftIcon: new photonui.FAIcon("fa-bold"),
textVisible: false,
value: true
  }),
  new photonui.ToggleButton({
appearance: "flat",
leftIcon: new photonui.FAIcon("fa-italic"),
textVisible: false
  }),
  new photonui.ToggleButton({
appearance: "flat",
leftIcon: new photonui.FAIcon("fa-underline"),
textVisible: false
  }),
    ]
});

photonui.domInsert(fl, document.getElementById("widget-area"));
  