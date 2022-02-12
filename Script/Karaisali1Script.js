
function imageBlock(no, x, y) {

    this.no = no;
    this.x = x;
    this.y = y;
    this.isSelected = false;
}


function jigsaw(perdeID, imageID, rows,columns) {

    var ANA_RESIM_GENISLIK = 800;
    var ANA_RESIM_YUKSEKLIK = 600;


    var PARCA_RESIM_GENISLIK = 600;
    var PARCA_RESIM_YUKSEKLIK = 450;


    var TOPLAM_SATIR = rows;// 4;
    var TOPLAM_SUTUN = columns;  //4;

    var TOPLAM_PARCA = TOPLAM_SATIR * TOPLAM_SUTUN;

    var PARCA_BOLUM_GENISLIK = Math.round(ANA_RESIM_GENISLIK / TOPLAM_SUTUN);
    var PARCA_BOLUM_YUKSEKLIK = Math.round(ANA_RESIM_YUKSEKLIK / TOPLAM_SATIR);


    var BOLUM_GENISLIK = 0; // Math.round(PARCA_RESIM_GENISLIK / TOPLAM_SUTUN);
    var BOLUM_YUKSEKLIK = 0; // Math.round(PARCA_RESIM_YUKSEKLIK / TOPLAM_SATIR);



    var resim1;
    var perde;
    var ctx;

    this.perdeID = perdeID;
    this.imageID = imageID;

    this.top = 0;
    this.left = 0;

    this.imageBlockList = new Array();


    this.blockList = new Array();

    this.selectedBlock = null;


    this.mySelf = this;


    this.initDrawing = function () {
        mySelf = this;
        selectedBlock = null;
        perde = document.getElementById(perdeID);

        ctx = perde.getContext('2d');

        // register events
        //perde.ondblclick = handleOnMouseDbClick;
        perde.onmousedown = handleOnMouseDown;
        perde.onmouseup = handleOnMouseUp;
        perde.onmouseout = handleOnMouseOut;
        perde.onmousemove = handleOnMouseMove;

        resim1 = document.getElementById(imageID);


        initializeNewGame();
    };
    
    function initializeNewGame() {

        // Set block 
        BOLUM_GENISLIK = Math.round(PARCA_RESIM_GENISLIK / TOPLAM_SUTUN);
        BOLUM_YUKSEKLIK = Math.round(PARCA_RESIM_YUKSEKLIK / TOPLAM_SATIR);


        // Draw image
        SetImageBlock();
        DrawGame();
    }


    this.showPreview = function () {

        var x1 = 20;
        var y1 = 20;
        var width = PARCA_RESIM_GENISLIK - (x1 * 2);
        var height = PARCA_RESIM_YUKSEKLIK - (y1 * 2);

        ctx.save();

        ctx.drawImage(resim1, 0, 0, ANA_RESIM_GENISLIK, ANA_RESIM_YUKSEKLIK, x1, y1, width, height);


        // DRAE RECTANGLE

        ctx.fillStyle = '#00f'; // mavi
        ctx.strokeStyle = '#f00'; // deliler kýrmýzý severrr
        ctx.lineWidth = 4;

        ctx.strokeRect(x1 - 2, y1 - 2, width + 4, height + 4);


        ctx.restore();


    };

  
    function DrawGame() {

        clear(ctx);
        drawLines();
        drawAllImages();

        if (selectedBlock) {
            drawImageBlock(selectedBlock);
        }
    }

    function SetImageBlock() {

        var total = TOPLAM_PARCA;
        imageBlockList = new Array();
        blockList = new Array();

        var x1 = PARCA_RESIM_GENISLIK + 20;
        var x2 = perde.width - 50;
        var y2 = PARCA_RESIM_YUKSEKLIK;
        for (var i = 0; i < total; i++) {

            var randomX = randomXtoY(x1, x2, 2);
            var randomY = randomXtoY(0, y2, 2);
       
            var imgBlock = new imageBlock(i, randomX, randomY);

            imageBlockList.push(imgBlock);

            var x = (i % TOPLAM_SUTUN) * BOLUM_GENISLIK;
            var y = Math.floor(i / TOPLAM_SUTUN) * BOLUM_YUKSEKLIK;

            var block = new imageBlock(i, x, y);
            blockList.push(block);

        }

    }

    function drawLines() {
       
       ctx.strokeStyle = "#e9e9e9";
        
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // cýz bir yatay
        for (var i = 0; i <= TOPLAM_SUTUN; i++) {
            var x = BOLUM_GENISLIK * i;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 250);
        }

        // cýz bir dikme :)
        for (var i = 0; i <= TOPLAM_SATIR; i++) {
            var y = BOLUM_YUKSEKLIK * i;
            ctx.moveTo(0, y);
            ctx.lineTo(300, y);
        }


        ctx.closePath();
        ctx.stroke();
    }

    function drawAllImages() {

        for (var i = 0; i < imageBlockList.length; i++) {
            var imgBlock = imageBlockList[i];
            if (imgBlock.isSelected == false) {

                drawImageBlock(imgBlock);
            }
        }
    }

    function drawImageBlock(imgBlock) {
        
        drawFinalImage(imgBlock.no, imgBlock.x, imgBlock.y, BOLUM_GENISLIK, BOLUM_YUKSEKLIK);
    }

    function drawFinalImage(index, destX, destY, destWidth, destHeight) {

        ctx.save();

        var srcX = (index % TOPLAM_SUTUN) * PARCA_BOLUM_GENISLIK;
        var srcY = Math.floor(index / TOPLAM_SUTUN) * PARCA_BOLUM_YUKSEKLIK;

        ctx.drawImage(resim1, srcX, srcY, PARCA_BOLUM_GENISLIK, PARCA_BOLUM_YUKSEKLIK, destX, destY, destWidth, destHeight);

        ctx.restore();
    }

    function drawImage(image) {

        ctx.save();

        ctx.drawImage(image, 0, 0, BOLUM_GENISLIK, BOLUM_GENISLIK, 10, 10, BOLUM_GENISLIK, BOLUM_GENISLIK);

        ctx.restore();
    }

    var interval = null;
    var remove_width;
    var remove_height;
    
    function OnFinished() {

        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'Audio/finish.mp3');
        audioElement.play();

        remove_width = BOLUM_GENISLIK;
        remove_height = BOLUM_YUKSEKLIK;
        // Clear Board
        interval = setInterval(function () { mySelf.ClearGame(); }, 100);
    }

    this.ClearGame = function () {
        //   alert("f");
        remove_width -= 30;
        remove_height -= 20;

        if (remove_width > 0 && remove_height > 0) {

            clear(ctx);

            for (var i = 0; i < imageBlockList.length; i++) {
                var imgBlock = imageBlockList[i];

                imgBlock.x += 10;
                imgBlock.y += 10;

                drawFinalImage(imgBlock.no, imgBlock.x, imgBlock.y, remove_width, remove_height);
            }

            // DrawGame();
        } else {

            clearInterval(interval);
           
            // Restart game
            initializeNewGame(); 
          //  alert("Congrats....");

        }
    };
	
// Oleyler arkkadaþ
    

    function handleOnMouseDbClick(e) {

        // selectedBlock = GetImageBlock(e.pageX, e.pageY);
        //alert("clicked");

    }


    function handleOnMouseOut(e) {

        // evelki seçtiðini sutlaaa
        if (selectedBlock != null) {

            imageBlockList[selectedBlock.no].isSelected = false;
            selectedBlock = null;
            DrawGame();

        }

    }

    function handleOnMouseDown(e) {

        // gene þutla yani depikle
        if (selectedBlock != null) {

            imageBlockList[selectedBlock.no].isSelected = false;

        }

        selectedBlock = GetImageBlock(imageBlockList, e.pageX, e.pageY);

        if (selectedBlock) {
            imageBlockList[selectedBlock.no].isSelected = true;
        }

    }


    function handleOnMouseUp(e) {

        if (selectedBlock) {
            var index = selectedBlock.no;
            //   alert(index);

            var block = GetImageBlock(blockList, e.pageX, e.pageY);
            if (block) {

                var blockOldImage = GetImageBlockOnEqual(imageBlockList, block.x, block.y);
                if (blockOldImage == null) {
                    imageBlockList[index].x = block.x;
                    imageBlockList[index].y = block.y;
                }
            }
            else {
                imageBlockList[index].x = selectedBlock.x;
                imageBlockList[index].y = selectedBlock.y;
            }

            imageBlockList[index].isSelected = false;
            selectedBlock = null;
            DrawGame();

            if (isFinished()) {
                OnFinished();
            }

        }
    }

    function handleOnMouseMove(e) {

        if (selectedBlock) {

            selectedBlock.x = e.pageX  - 25;
            selectedBlock.y = e.pageY  - 25;

            DrawGame();

        }
    }

    
    function clear(c) {
        c.clearRect(0, 0, perde.width, perde.height);
    }

    function randomXtoY(minVal, maxVal, floatVal) {
        var randVal = minVal + (Math.random() * (maxVal - minVal));
        var val = typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);

        return Math.round(val);
    }


    function GetImageBlock(list, x, y) {

        //for (var i = 0; i < list.length; i++) {
        for (var i = list.length - 1; i >= 0; i--) {
            var imgBlock = list[i];

            var x1 = imgBlock.x;
            var x2 = x1 + BOLUM_GENISLIK;

            var y1 = imgBlock.y;
            var y2 = y1 + BOLUM_YUKSEKLIK;

            if (
                (x >= x1 && x <= x2) &&
                (y >= y1 && y <= y2)
            ) {
                //alert("found: " + imgBlock.no);

                var img = new imageBlock(imgBlock.no, imgBlock.x, imgBlock.y);
                //drawImageBlock(img);
                return img;

            }
        }

        return null;
    }


    function GetImageBlockOnEqual(list, x, y) {

        for (var i = 0; i < list.length; i++) {
            var imgBlock = list[i];

            var x1 = imgBlock.x;
            var y1 = imgBlock.y;

            if (
                (x == x1) &&
                (y == y1)
            ) {

                var img = new imageBlock(imgBlock.no, imgBlock.x, imgBlock.y);
                //drawImageBlock(img);
                return img;

            }
        }

        return null;
    }



    function isFinished() {

        var total = TOPLAM_PARCA;

        for (var i = 0; i < total; i++) {

            var img = imageBlockList[i];
            var block = blockList[i];

            if (
                (img.x != block.x) ||
                (img.y != block.y)
                ) {
                return false;
            }

        }

        return true;
    }

}


