var TEMPLATE = "";
TEMPLATE += "<strong><%- title="" %=""></%-></strong>";
TEMPLATE += "<ul>";
TEMPLATE += "<% for="" (var="" i="0" ;="" <="" animals.length="" i++)="" {="" %="">";
TEMPLATE += "<li><%- animals[i]="" %=""></%-></li>";
TEMPLATE += "<% }="" %="">";
TEMPLATE += "</%></%></ul>";

var tpl = new photonui.Template({
    template: TEMPLATE,
    data: {
        animals: ["cat", "dog", "parrot", "fish"],
        title: "Animals:"
    }
});

photonui.domInsert(tpl, "demo");
