document.addEventListener("DOMContentLoaded", function() {
    // First example
    let element = document.getElementById('canvas1');
    let imagesArray = Array.from(new Array(90), (v, k) => {
        let number = String(k).padStart(4, "0");
        return `https://distracted-villani-e19534.netlify.app/train/rotation${number}.jpg`;
    });
    let loadingBlock = document.querySelector('.loading1');

    // Initialization
    let instance1 = animateImages.init(element, {
        images: imagesArray,
        preload: "partial",
        preloadNumber: 20,
        fps: 60,
        poster: imagesArray[0],
        draggable: true,
        loop: true,
        reverse: false,
        autoplay: false,
        fillMode: 'cover',
        tagShowHide: true,
        //ratio: 2.56,
        onPreloadFinished: (lib) => {
            console.log('Callback: onPreloadFinished');
            //lib.play();
        },
        onPosterLoaded(){
            console.log('Callback: onPosterLoaded');
        }
    });
    instance1.preloadImages();
    setupControls();
    //instance1.play();

    // Events
    element.addEventListener('animate-images:loading-progress', function (e){
        //console.log(`Event: loading progress: ${e.detail.progress}`);
        loadingBlock.querySelector('span').textContent = Math.floor( +e.detail.progress * 100);
    });
    element.addEventListener('animate-images:preload-finished', function (e){
        console.log(`Event: animate-images:preload-finished`);
    });
    element.addEventListener('animate-images:animation-end', function () {
        console.log(`Event: animate-images:animation-end`);
    });
    element.addEventListener('animate-images:poster-loaded', function () {
        console.log(`Event: animate-images:poster-loaded`);
    });
    element.addEventListener('animate-images:loading-error', function () {
        console.log(`Event: animate-images:loading-error`);
    });
    element.addEventListener('animate-images:drag-start', function () {
        console.log(`Event: animate-images:drag-start`);
    });
    element.addEventListener('animate-images:drag-change', function (e) {
        console.log(`Event: animate-images:drag-change`);
    });
    element.addEventListener('animate-images:drag-end', function () {
        console.log(`Event: animate-images:drag-end`);
    });

    // add the frame number event, so just add the tag in here
    element.addEventListener('animate-images:rendering-frame', function (e) {
        // console.log("frame: " + e.detail.frameNumberOrImage);
        if (instance1.getOption('tagShowHide'))
            updateTags(e.detail.frameNumberOrImage);
    })

    // Controls
    function setupControls(lib){
        console.log('setup controls');
        document.querySelector('.js-play').addEventListener('click', () => {
            instance1.play();
        });
        document.querySelector('.js-stop').addEventListener('click', () => {
            instance1.stop();
        });
        document.querySelector('.js-toggle').addEventListener('click', () => {
            instance1.togglePlay();
        });
        document.querySelector('.js-next').addEventListener('click', () => {
            instance1.next();
        });
        document.querySelector('.js-prev').addEventListener('click', () => {
            instance1.prev();
        });
        document.querySelector('.js-reset').addEventListener('click', () => {
            instance1.reset();
        });
        let reverse = instance1.getOption('reverse');
        let reverseButton = document.querySelector('.js-reverse');
        reverseButton.addEventListener('click', () => {
            reverse = !reverse;
            instance1.setReverse(reverse);
            reverseButton.classList.remove('on', 'off');
            reverseButton.classList.add( (reverse) ? 'on' : 'off' );
        });
        reverseButton.classList.add( (reverse) ? 'on' : 'off' );

        let loop = instance1.getOption('loop');
        let loopButton = document.querySelector('.js-loop');
        loopButton.addEventListener('click', () => {
            loop = !loop;
            instance1.setOption('loop', loop);
            loopButton.classList.remove('on', 'off');
            loopButton.classList.add( (loop) ? 'on' : 'off' );
        });
        loopButton.classList.add( (loop) ? 'on' : 'off' );

        let draggable = instance1.getOption('draggable');
        let draggableButton = document.querySelector('.js-draggable');
        draggableButton.addEventListener('click', () => {
            draggable = !draggable;
            instance1.setOption('draggable', draggable);
            draggableButton.classList.remove('on', 'off');
            draggableButton.classList.add( (draggable) ? 'on' : 'off' );
        });
        draggableButton.classList.add( (draggable) ? 'on' : 'off' );

        let fillMode = instance1.getOption('fillMode');
        let coverBtn = document.querySelector('.js-cover');
        let containBtn = document.querySelector('.js-contain');
        let onBtn = (fillMode === 'cover') ? coverBtn : containBtn;
        onBtn.classList.add('on');
        coverBtn.addEventListener('click', () => {
            changeFillMode('cover');
            containBtn.classList.remove('on');
            coverBtn.classList.add('on');
        });
        containBtn.addEventListener('click', () => {
            changeFillMode('contain');
            coverBtn.classList.remove('on');
            containBtn.classList.add('on');
        });
        function changeFillMode(mode){
            fillMode = mode;
            instance1.setOption('fillMode', mode);
        }

        let tagShowHide = instance1.getOption('tagShowHide');
        let tagShowHideBtn = document.querySelector('.js-tagshowhide');
        tagShowHideBtn.addEventListener('click',()=>{
            tagShowHide = !tagShowHide;
            toggleTag(tagShowHide);
            instance1.setOption('tagShowHide', tagShowHide);
            tagShowHideBtn.classList.remove('on','off');
            tagShowHideBtn.classList.add((tagShowHide)?'on':'off');
        })
        tagShowHideBtn.classList.add((tagShowHide)?'on':'off');

        function toggleTag(mode){
            let tagEle = document.querySelector('.tag-overlay');
            if (tagEle != null){
                if (mode == false){
                    tagEle.style.visibility = "hidden";
                }else {
                    tagEle.style.visibility = "visible";
                }
            }

        }





        let framesInput = document.querySelector('.js-frames-input');
        framesInput.setAttribute('max', instance1.getTotalImages());
        framesInput.addEventListener('input', function() {
            instance1.setFrame(this.value);
        });

        // Inputs
        document.querySelector('.js-set-frame').addEventListener('click', function() {
            instance1.setFrame(this.closest('.js-option-block').querySelector('input').value);
        });
        document.querySelector('.js-play-to').addEventListener('click', function() {
            instance1.playTo(this.closest('.js-option-block').querySelector('input').value)
                .then((instance)=> {
                    console.log('play to animation finished');
                });
        });
        document.querySelector('.js-play-frames').addEventListener('click', function() {
            instance1.playFrames(this.closest('.js-option-block').querySelector('input').value)
                .then((instance)=> {
                    console.log('playFrames animation finished');
                });
        });
        document.querySelector('.js-set-fps').addEventListener('click', function() {
            instance1.setOption("fps", this.closest('.js-option-block').querySelector('input').value);
        });
        document.querySelector('.js-set-ratio').addEventListener('click', function() {
            instance1.setOption("ratio", this.closest('.js-option-block').querySelector('input').value);
        });
    }

});

let tagTestOption =
    [
        {
            id: 'tag1',
            text: '标签1',
            frameStart: 1,
            frameEnd: 45,
            fixed: false,
            keyPos: [[20, 20], [100, 100], [300, 300]],
            keyFrames: [1, 25, 45],
            show: true,
        }
    ]

function updateTags(frame) {
    for (let i = 0; i < tagTestOption.length; i++){
        if (tagTestOption[i].show){
            if (frame >= tagTestOption[i].frameStart && frame <= tagTestOption[i].frameEnd){
                // create the tag if there's not
                let canvasEle = document.querySelector('.canvas1-block');
                let createNewTagFlag = true;

                let e = canvasEle.querySelector('.' + tagTestOption[i].id);
                if (e != null){
                    createNewTagFlag = false;
                }

                if (createNewTagFlag) {
                    let t = document.createElement("div");

                    t.classList.add('info');
                    t.classList.add('tag-overlay');
                    t.classList.add(tagTestOption[i].id);

                    t.insertAdjacentHTML('beforeend',"<i class=\"bi bi-info-circle-fill\"></i>" +
                        "<span class=\"extra-info\">" + tagTestOption[i].text + "<\span>");

                    // let tt = document.createElement("h1");
                    // tt.textContent = tagTestOption[i].text;
                    // t.appendChild(tt);


                    t.style.visibility = "hidden";
                    canvasEle.appendChild(t);
                }
                // move tag
                let t = canvasEle.querySelector('.'+ tagTestOption[i].id)
                // given frame get position
                let c = getPosition(frame, tagTestOption[i].keyPos, tagTestOption[i].keyFrames);

                console.log("Moving: " + c.x + ' ' + c.y);
                t.style.visibility = "visible";
                t.style.left = parseFloat(c.x)+'px';
                t.style.top = parseFloat(c.y)+'px';


            } else {
                // hide element
                let canvasEle = document.querySelector('.canvas1-block');
                let t = canvasEle.querySelector('.'+ tagTestOption[i].id)
                if (t != null)
                    t.style.visibility = "hidden";
            }
        }
    }
}

// given coordinate frame set to calc position
function getPosition(frame, keyPos, keyFrames){
    if (keyPos.length !== keyFrames.length)
    {
        console.log("Error! input key frame setting Error!");
        return {x:0,y:0};
    }
    for (let i = 1 ; i < keyFrames.length; ++i){
        if (frame >= keyFrames[i-1] && frame <= keyFrames[i]){
            let x = (frame - keyFrames[i-1]) / (keyFrames[i] - keyFrames[i-1]) *
                (keyPos[i][0] - keyPos[i-1][0]) + keyPos[i-1][0];
            let y = (frame - keyFrames[i-1]) / (keyFrames[i] - keyFrames[i-1]) *
                (keyPos[i][1] - keyPos[i-1][1]) + keyPos[i-1][1];
            return {x: x, y:y};
        }
    }
}