import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, prePathUrl, setExtraVolume } from "../components/CommonFunctions";


const maskPathList = [
    ['1'],
    ['2'],
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7'],
    ['8'],
    ['9'],
    ['10'],
]


const maskTransformList = [
    { x: 0.0, y: -0.05, s: 1.4 },
    { x: 0.0, y: 0.0, s: 1 },
    { x: 0.5, y: 0.3, s: 2 },
    { x: 0.4, y: -0.4, s: 1.8 },
    { x: 0.25, y: 0.3, s: 2 },
    { x: 0.25, y: -0.1, s: 2 },
    { x: -0.4, y: 0.4, s: 1.8 },
    { x: -0.25, y: 0.2, s: 2 },
    { x: -0.2, y: -0.35, s: 2 },
    { x: -0.1, y: 0.1, s: 1.2 },
]

let currentMaskNum = 0;
let subMaskNum = 0;

// plus values..
const marginPosList = [
    { s: 2, l: 0.0, t: 0.0 },
    { s: 2, l: 0, t: 0.0 },
    { s: 2, l: 0.5, t: 0.3 },
    { s: 2, l: 0.4, t: -0.45 },
    { s: 2, l: 0.2, t: 0.3 },
    { s: 2, l: 0.3, t: -0.2 },
    { s: 2, l: -0.35, t: 0.5 },
    { s: 1, l: -0.2, t: 0.2 },
    { s: 2, l: -0.2, t: -0.5 },
    { s: 2, l: -0.5, t: 0.0 },
]

const audioPathList = [
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7'],
    ['8'],
    ['9'],
    ['10'],
    ['11'],
    ['12'],
]



const subMarkInfoList = [

]

let isEven = true

const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, bgLoaded }, ref) => {

    const audioList = useContext(UserContext)

    const baseObject = useRef();

    const blackWhiteObjects = [useRef(), useRef()];
    const currentImages = [useRef(), useRef()]
    const bodyAudios = [audioList.bodyAudio1, audioList.bodyAudio3]

    const colorObject = useRef();


    const subMaskRefList = Array.from({ length: 2 }, ref => useRef())
    const [isSceneLoad, setSceneLoad] = useState(false)

    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {


            setExtraVolume(audioList.bodyAudio1, 4)
            setExtraVolume(audioList.bodyAudio2, 3.5)
            setExtraVolume(audioList.bodyAudio3, 4)
            

            loadFunc()

            baseObject.current.className = 'aniObject'


            audioList.bodyAudio2.src = getAudioPath('intro/2');

            bodyAudios[0].src = getAudioPath('intro/3');

            blackWhiteObjects[0].current.style.WebkitMaskImage = 'url("' +
                returnImgPath(maskPathList[currentMaskNum][0], true) + '")'

            bodyAudios[1].src = getAudioPath('intro/4');

            blackWhiteObjects[1].current.style.WebkitMaskImage = 'url("' +
                returnImgPath(maskPathList[currentMaskNum + 1][0], true) + '")'


            setTimeout(() => {
                audioList.bodyAudio2.play()
                setTimeout(() => {
                    setExtraVolume(audioList.bodyAudio2, 4)
                    showIndividualImage()
                }, audioList.bodyAudio2.duration * 1000 + 1000);
            }, 3000);

        },
        sceneEnd: () => {

            currentMaskNum = 0;
            subMaskNum = 0;
            isEven = true;

            setSceneLoad(false)
        }
    }))

    function returnImgPath(imgName, isAbs = false) {
        return isAbs ? (prePathUrl() + 'images/intro/' + imgName + '.png')
            : ('intro/' + imgName + '.png');
    }

    const durationList = [
        2, 1, 1, 1.4, 1.4, 1.4, 1, 1, 1, 1.4, 1.4, 1.4, 1.5, 1.5
    ]
    function showIndividualImage() {

        const currentIndex = isEven ? 0 : 1

        let currentMaskName = maskPathList[currentMaskNum]

        baseObject.current.style.transition = durationList[currentMaskNum] + 's'
        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,'
            + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            let timeDuration = bodyAudios[currentIndex].duration * 1000 + 500
            let isSubAudio = false

            if (currentMaskName != 'sub') {
                blackWhiteObjects[currentIndex].current.className = 'show'
                colorObject.current.className = 'hide'
            }

            else {
                subMarkInfoList[subMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index == 0)
                            colorObject.current.className = 'hide'
                        subMaskRefList[index].current.setClass('appear')
                        if (value.ps != null) {
                            subMaskRefList[index].current.setStyle({
                                transform:
                                    "translate(" + _baseGeo.width * value.pl / 100 + "px,"
                                    + _baseGeo.height * value.pt / 100 + "px)"
                                    + "scale(" + (1 + value.ps / 100) + ") "
                            })

                        }
                    }, value.t);
                })
            }

            if (maskPathList[currentMaskNum].length > 1) {
                maskPathList[currentMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index > 0) {
                            blackWhiteObjects[currentIndex].current.style.WebkitMaskImage = 'url("' +
                                returnImgPath(maskPathList[currentMaskNum][index], true) + '")'
                        }
                    }, (bodyAudios[currentIndex].duration * 1000 + 1000) / maskPathList[currentMaskNum].length * index);
                }
                )
            }

            setTimeout(() => {

                if (marginPosList[currentMaskNum].s != null) {
                    currentImages[currentIndex].current.style.transform =
                        "translate(" + _baseGeo.width * marginPosList[currentMaskNum].l / 100 + "px,"
                        + _baseGeo.height * marginPosList[currentMaskNum].t / 100 + "px)"
                        + "scale(" + (1 + marginPosList[currentMaskNum].s / 100) + ") "
                }


                bodyAudios[currentIndex].play().catch(error => { });

                setTimeout(() => {
                    if (currentMaskNum < audioPathList.length - 2) {
                        bodyAudios[currentIndex].src = getAudioPath('intro/' + audioPathList[currentMaskNum + 2][0]);
                    }

                    setTimeout(() => {
                        currentImages[currentIndex].current.style.transform = "scale(1)"
                        if (currentMaskName == 'sub') {
                            subMaskRefList.map(mask => {
                                if (mask.current) {
                                    mask.current.setStyle({
                                        transform: "scale(1)"
                                    })
                                }
                            })
                        }

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            if (currentMaskNum == maskPathList.length - 1) {
                                setTimeout(() => {
                                    baseObject.current.style.transition = '2s'

                                    baseObject.current.style.transform =
                                        'translate(' + '0%,0%)' +
                                        'scale(1)'

                                    setTimeout(() => {
                                        nextFunc()
                                    }, 6000);

                                }, 2000);
                            }
                            else {
                                if (currentMaskName == 'sub') {
                                    subMaskRefList.map(mask => {
                                        if (mask.current) {

                                            setTimeout(() => {
                                                mask.current.setClass('hide')
                                            }, 500);
                                        }
                                    })
                                    subMaskNum++
                                }

                                currentMaskNum++;

                                currentMaskName = maskPathList[currentMaskNum]
                                if (currentMaskName != 'sub') {
                                    if (currentMaskNum < maskPathList.length - 1)
                                        blackWhiteObjects[currentIndex].current.style.WebkitMaskImage =
                                            'url("' + returnImgPath(maskPathList[currentMaskNum + 1], true) + '")'
                                }
                                else
                                    subMarkInfoList[subMaskNum].map((value, index) => {
                                        subMaskRefList[index].current.setMask(returnImgPath(value.p, true))
                                    })

                                blackWhiteObjects[currentIndex].current.className = 'hide'
                                setTimeout(() => {
                                    isEven = !isEven
                                    showIndividualImage()
                                }, 3000);
                            }
                        }, 500);
                    }, 2000);
                }, timeDuration);
            }, 1000);

        }, durationList[currentMaskNum] * 1000);
    }

    return (
        <div>
            {
                isSceneLoad &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%'
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',

                            }}
                            src={returnImgPath('grey_bg', true)}
                        />
                    </div>

                    <div
                        ref={blackWhiteObjects[0]}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' +
                                returnImgPath(maskPathList[0][0], true)
                                + '")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat",
                            transition: '0.5s'
                        }}>
                        <div
                            ref={currentImages[0]}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                                width: '100%',
                                height: '100%',
                                transition: '0.5s'
                            }}
                        >
                            <BaseImage url={'bg/base.png'} />
                        </div>
                    </div>

                    <div
                        ref={blackWhiteObjects[1]}
                        className='hideObject'
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' +
                                returnImgPath(maskPathList[1][0], true)
                                + '")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat",
                            transition: '0.5s'
                        }}>
                        <div
                            ref={currentImages[1]}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                                width: '100%',
                                height: '100%',
                                transition: '0.5s'
                            }}
                        >
                            <BaseImage url={'bg/base.png'} />
                        </div>
                    </div>



                    <div
                        ref={colorObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                        }} >
                        <BaseImage
                            onLoad={bgLoaded}
                            url={'bg/base.png'}
                        />
                    </div>
                </div>
            }
        </div>
    );
});

export default Scene;
