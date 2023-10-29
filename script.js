const wordEnInput = document.getElementById('wordEn')
const wordTrInput = document.getElementById('wordTr')
const addBtn = document.getElementById('addBtn')

// main section start
const options = {
    method: "GET"
}

fetch('/getWords', options)
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        let canvas = document.getElementById('canvas')
        let context = canvas.getContext('2d')

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        let initialCanvasWidth = canvas.width;
        let initialCanvasHeight = canvas.height;

        let words = [],
            WPS = 7,
            x = 5

        for (let i = 0; i < x; i++) {
            words.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 30,
                vx: Math.floor(Math.random() * 10) - 5,
                vy: Math.floor(Math.random() * 10) - 5,
                wordEn: data[i].wordEn
            })
        }
        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.globalCompositeOperation = 'lighter'
            context.globalAlpha = 0.7

            for (let i = 0; i < words.length; i++) {
                let w = words[i]
                let scaledX = w.x * (canvas.width / initialCanvasWidth)
                let scaledY = w.y * (canvas.height / initialCanvasHeight)

                context.font = '700 25px "Cabin"'
                context.fillStyle = '#e7f1fa'
                context.textAlign = 'center'
                context.textBaseline = 'middle'
                context.fillText(w.wordEn.toUpperCase(), scaledX, scaledY)
                context.beginPath()
                context.fill()
            }
        }

        function update() {
            for (let i = 0; i < words.length; i++) {
                let w = words[i]
                w.x += w.vx / WPS
                w.y += w.vy / WPS

                if (w.x < 0 || w.x > canvas.width) {
                    w.vx = w.vx * (-1)
                }
                if (w.y < 0 || w.y > canvas.height) {
                    w.vy = w.vy * (-1)
                }
            }
        }
        canvas.addEventListener('mousemove', handleMouseMove);
        function handleMouseMove(event) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            if (words.length < 50) {
                for (let i = 0; i < words.length; i++) {
                    const w = words[i];
                    const distance = Math.sqrt((w.x - mouseX) ** 2 + (w.y - mouseY) ** 2)

                    if (distance <= w.radius) {
                        words.push({
                            x: Math.random() * initialCanvasWidth,
                            y: Math.random() * initialCanvasHeight,
                            radius: 30,
                            vx: Math.floor(Math.random() * 10) - 5,
                            vy: Math.floor(Math.random() * 10) - 5,
                            wordEn: data[Math.floor(Math.random() * data.length)].wordEn
                        });
                        break
                    }
                }
            }
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            draw()
        }

        function tick() {
            draw()
            update()
            requestAnimationFrame(tick)
        }

        window.addEventListener('resize', resizeCanvas)
        resizeCanvas()
        tick()
    })
    .catch((error) => {
        console.log(error)
    });

// Main section end


// Main navigation start
function openSection(href, sectionSelector) {
    document.addEventListener('DOMContentLoaded', () => {
        let englishLevelsLink = document.querySelector('.main-nav-links[href="' + href + '"]')
        let targetSection = document.querySelector(sectionSelector)

        englishLevelsLink.addEventListener('click', function (e) {
            e.preventDefault()
            let header = document.querySelector('.header')
            let mainNav = document.querySelector('.main-nav')
            let targetOffset = targetSection.offsetTop
            if (href === '/main') {
                window.scrollTo({
                    top: targetOffset + header + mainNav,
                    behavior: 'smooth'
                })
            } else {
                window.scrollTo({
                    top: targetOffset,
                    behavior: 'smooth'
                })
            }
        })
    })
}

openSection('/main', '.main-section')
openSection('/learn', '.learn-section')
openSection('/dictionary', '.dictionary-section')
openSection('/english-levels', '.english-levels-section')

// Main navigation end


// Learn section start

document.getElementById('randomWordBtn').addEventListener('click', async () => {
    const randomWordContainer = document.getElementById('randomWords')

    const response = await fetch('/getRandomTranslation', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.status === 200) {
        const data = await response.json()
        const randomWordTr = data.translation.wordTr
        const randomWordEn = data.translation.wordEn.toLowerCase()

        randomWordContainer.setAttribute('data-word-en', randomWordEn)
        randomWordContainer.textContent = randomWordTr
    } else {
        randomWordContainer.textContent = 'Error getting random word'
    }
});

document.getElementById('checkButton').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value.trim()
    const gameResult = document.getElementById('gameResult')
    const randomWordEn = document.getElementById('randomWords').getAttribute('data-word-en')

    if (userInput.toLowerCase() === randomWordEn.toLowerCase()) {
        gameResult.innerHTML = 'Correct!';
        document.getElementById('userInput').value = ''
    } else {
        gameResult.innerHTML = 'Incorrect. Try again.';
        document.getElementById('userInput').value = ''
    }
})

document.getElementById('btnClean').addEventListener('click', function () {
    document.getElementById('userInput').value = ''
    document.getElementById('gameResult').textContent = ''
    document.getElementById('randomWords').textContent = ''
})

// Learn section end


// Dictionary section start

document.getElementById('addBtn').addEventListener('click', (e) => {
    e.preventDefault()

    let wordEn = document.getElementById('wordEn')
    let wordTr = document.getElementById('wordTr')
    let wordList = document.getElementById('wordList')

    let wordInputEnValue = wordEn.value
    let wordInputTrValue = wordTr.value

    let listItem = document.createElement('li')
    listItem.textContent = `${wordInputEnValue} - ${wordInputTrValue}`

    wordList.appendChild(listItem)

    let savedWords = JSON.parse(localStorage.getItem('savedWords')) || []

    savedWords.push({wordEn: wordInputEnValue, wordTr: wordInputTrValue})

    localStorage.setItem('savedWords', JSON.stringify(savedWords))
})

let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
let wordList = document.getElementById('wordList');

savedWords.forEach((word) => {
    let listItem = document.createElement('li')
    listItem.textContent = `${word.wordEn} - ${word.wordTr}`
    wordList.appendChild(listItem)
});


function updateAddBtnVisibility() {
    const wordEn = wordEnInput.value.trim()
    const wordTr = wordTrInput.value.trim()

    if (wordEn !== '' && wordTr !== '') {
        addBtn.style.visibility = 'visible'
    } else {
        addBtn.style.visibility = 'hidden'
    }
}

updateAddBtnVisibility()

wordEnInput.addEventListener('input', updateAddBtnVisibility)
wordTrInput.addEventListener('input', updateAddBtnVisibility)


document.getElementById('wordEn').addEventListener('input', (e) => {
    let str = e.target.value
    if (!str.match(/^[a-z]+$/)) {
        e.target.value = str.slice(0, -1)
    }
})

document.getElementById('addBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    let wordIEn = document.getElementById('wordEn')
    let wordTr = document.getElementById('wordTr')

    let wordInputEnValue = wordIEn.value
    let wordInputTrValue = wordTr.value

    const response = await fetch('/addWords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wordEn: wordInputEnValue,
            wordTr: wordInputTrValue
        })
    });

    if (response.status === 201) {
        console.log('Word added successfully')
    } else {
        console.log('Failed to add word')
    }

    wordIEn.value = '';
    wordTr.value = '';
    addBtn.style.visibility = 'hidden'
})

document.getElementById('deleteBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/getWords', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json()
        console.log('Deleted')
    } catch (error) {
        console.error('Error deleting data:', error)
    }

    const wordList = document.getElementById('wordList')
    wordList.innerHTML = ''
})

// Dictionary section end


// English levels section start
function blockIncrease(blockSelector, height) {
    const blocks = document.querySelectorAll(blockSelector)
    const windowHeight = window.innerHeight

    window.addEventListener('scroll', () => {
        blocks.forEach(block => {
            const blockTop = block.getBoundingClientRect().top

            if (blockTop < windowHeight && blockTop > -block.offsetHeight) {
                const scaleFactor = (windowHeight - blockTop) / windowHeight
                block.style.height = `${height * scaleFactor}px`
            }
        })
    })
}

blockIncrease('.elementary-level', 200)
blockIncrease('.intermediate-level', 300)
blockIncrease('.advanced-level', 400)

// English levels section end




