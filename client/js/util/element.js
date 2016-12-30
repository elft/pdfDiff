//html
function createElement(el) {
    return el.tag ? detailed(el) : document.createElement(el);

    function detailed(el) {
        var element = document.createElement(el.tag),
            css = el.css,
            cssProp,
            classes = el.classes,
            i, j;

        //set some attributes
        el.name ? element.name = el.name : null;
        el.type ? element.type = el.type : null;
        el.value ? element.value = el.value : null;
        el.id ? element.id = el.id : null;
        el.children ? i = el.children.length : null;
        el.text ? element.innerText = el.text : null;
        el.tooltip ? element.title = el.tooltip : null;
        el.placeholder ? element.placeholder = el.placeholder : null;
        el.editable ? element.contentEditable = el.editable : null;

        //class styling
        if (classes) j = classes.length;
        while (j--) {
            element.classList.add(classes[j]);
        }

        //inline styling
        for (cssProp in css) {
            if (css.hasOwnProperty(cssProp)) {
                element.style[cssProp] = css[cssProp];
            }
        }

        while (el.tag === "select" && i--) {
            element.appendChild(detailed({ tag: "option", id: el.children[i], text: el.children[i] }));
        }

        return element;
    }
}

//svg
function createElementNS(el) {
    return el.tag ? detailed(el) : document.createElementNS("http://www.w3.org/2000/svg", el);

    function detailed(el) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", el.tag),
            properties = el.properties,
            value,
            i;

        for (value in properties) {
            if (properties.hasOwnProperty(value)) {
                element.setAttribute(value, properties[value]);
            }
        }
        return element;
    }
}