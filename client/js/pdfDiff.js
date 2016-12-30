var pdfDiff = function () {
    this.create();
    this.append();
    this.bind();
    this.render();
}

pdfDiff.prototype.create = function () {
    this.elContainer = createElement({ tag: "div", classes: ["container"] });
    this.elControler = createElement({ tag: "div", classes: ["controler"] });
    this.elCompare = createElement({ tag: "button", text: "Compare", classes: ["button"] });
    this.elReset = createElement({ tag: "button", text: "Reset", classes: ["button"] });
    this.elChange = createElement({ tag: "span", text: " change in pixels 0.0%" });
    this.elFirstPDF = createElement({ tag: "div", text: "First PDF(Drag n Drop)", classes: ["container-canvas"] });
    this.elSecondPDF = createElement({ tag: "div", text: "Second PDF(Drag n Drop)", classes: ["container-canvas"] });
}

pdfDiff.prototype.append = function () {
    this.elControler.appendChild(this.elCompare);
    this.elControler.appendChild(this.elReset);
    this.elControler.appendChild(this.elChange);
    this.elContainer.appendChild(this.elControler);
    this.elContainer.appendChild(this.elFirstPDF);
    this.elContainer.appendChild(this.elSecondPDF);
}

pdfDiff.prototype.bind = function () {
    this.elCompare.addEventListener('click', this.getPixels.bind(this), true);
    this.elReset.addEventListener('click', this.reset.bind(this), true);
    this.elFirstPDF.addEventListener('drop', this.drop.bind(this), false);
    this.elFirstPDF.addEventListener('dragover', this.dragOver.bind(this), false);
    this.elSecondPDF.addEventListener('drop', this.drop.bind(this), false);
    this.elSecondPDF.addEventListener('dragover', this.dragOver.bind(this), false);
}

pdfDiff.prototype.render = function () {
    document.body.appendChild(this.elContainer);
}

pdfDiff.prototype.dragOver = function (e) {
    e.preventDefault();
    e.stopPropagation();
}

pdfDiff.prototype.drop = function (e) {
    var me = this,
        fr = new FileReader();
    e.preventDefault();
    e.stopPropagation();

    fr.onloadend = function () {
        me.preivew(this.result, e.target);
    }

    fr.readAsArrayBuffer(e.dataTransfer.files[0]);
}

pdfDiff.prototype.reset = function () {
    this.elChange.innerHTML = " change in pixels 0.0%";
    this.elFirstPDF.innerHTML = "First PDF(Drag n Drop)";
    this.elSecondPDF.innerHTML = "Second PDF(Drag n Drop)";
}

pdfDiff.prototype.preivew = function (data, target) {
    var me = this;
    PDFJS.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.js';
    PDFJS.getDocument(data).then(function (pdf) {
        var i = pdf.pdfInfo.numPages,
            j = 1;
        while (j <= i) {
            pdf.getPage(j).then(function (page) {
                var scale = 1.5;
                var canvas = createElement("canvas");
                var viewport = page.getViewport(scale);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.style.display = "block";
                canvas.style.margin = "0px auto";
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
                target.appendChild(canvas);
            });
            j++;
        }
    });
}

pdfDiff.prototype.getPixels = function () {
    this.firstPDFpixels = [];
    this.secondPDFpixels = [];

    var i = this.elFirstPDF.childElementCount,
        j = 0;
    while (j < i) {
        var canvas = this.elFirstPDF.children[j];
        var ctx = canvas.getContext('2d');
        var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.firstPDFpixels[j] = image;
        j++;
    }

    var i = this.elSecondPDF.childElementCount,
        j = 0;
    while (j < i) {
        var canvas = this.elSecondPDF.children[j];
        var ctx = canvas.getContext('2d');
        var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.secondPDFpixels[j] = image;
        j++;
    }

    this.compare();
}

pdfDiff.prototype.compare = function () {
    var length = this.firstPDFpixels.length,
        j = 0;
    var pixelDiff = 0;
    var total = 0;
    while (j < length) {
        var firstCanvas = this.elFirstPDF.children[j];
        var firstCtx = firstCanvas.getContext('2d');

        var secondCanvas = this.elSecondPDF.children[j];
        var secondCtx = secondCanvas.getContext('2d');

        var rgbaLength = this.firstPDFpixels[j].data.length;

        for (var i = 0; i < rgbaLength; i += 4) {
            total++;
            if (this.firstPDFpixels[j].data[i] != this.secondPDFpixels[j].data[i] || this.firstPDFpixels[j].data[i + 1] != this.secondPDFpixels[j].data[i + 1] || this.firstPDFpixels[j].data[i + 2] != this.secondPDFpixels[j].data[i + 2]) {
                this.firstPDFpixels[j].data[i + 3] = 230;
                this.secondPDFpixels[j].data[i + 3] = 230;
                pixelDiff++;
            }
        }
        firstCtx.clearRect(0, 0, firstCanvas.width, firstCanvas.height);
        firstCtx.putImageData(this.firstPDFpixels[j], 0, 0);

        secondCtx.clearRect(0, 0, secondCanvas.width, secondCanvas.height);
        secondCtx.putImageData(this.secondPDFpixels[j], 0, 0);
        j++;
    }
    var percentChange = pixelDiff / total * 100;
    this.elChange.innerHTML = " change in pixels " + percentChange + "%";
}
