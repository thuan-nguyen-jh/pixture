function cloneCard(template) {
    const result = [];
    for (let card of template) {
        result.push(card.cloneNode(true));
    }
    return result;
}

const carousel = document.getElementsByClassName('carousel');
for (let item of carousel) {
    const container = item.querySelector('.carousel-container');
    const button = item.querySelector('.next-btn');
    const card = item.querySelector('.card');
    const cardWidth = card.offsetWidth + parseFloat(window.getComputedStyle(container).columnGap);

    let pressed = false;
    let startX;
    let x;

    const templateCards = cloneCard(container.children);
    let nextCards = cloneCard(templateCards);
    let currCards = Array.from(item.getElementsByClassName('card'));
    let prevCards = cloneCard(templateCards);
    let currentIndex = 0;

    container.prepend(...prevCards);
    container.scrollLeft += prevCards.length * cardWidth;
    container.append(...nextCards);

    container.addEventListener('scroll', (e) => {
        if (pressed) {
            return;
        }

        const firstNextCard = nextCards[0];
        const lastPrevCard = prevCards[prevCards.length - 1];

        const firstNextCardPosRelativeLeftSide = firstNextCard.offsetLeft - container.scrollLeft;
        const lastPrevCardPosRelativeRightSide = (lastPrevCard.offsetLeft) - (container.scrollLeft + container.offsetWidth);
        
        if (firstNextCardPosRelativeLeftSide <= 0) {
            console.log('Move to next fragment');
            
            prevCards.forEach(card => {
                card.remove();
                container.scrollLeft -= cardWidth;
            });

            prevCards = currCards;
            currCards = nextCards;
            nextCards = cloneCard(templateCards);
            container.append(...nextCards);

            currentIndex = currentIndex % currCards.length;
        }

        if (lastPrevCardPosRelativeRightSide >= 0) {
            console.log('Move to prev fragment');

            nextCards.forEach(card => {
                card.remove();
                container.scrollLeft += cardWidth;
            });

            nextCards = currCards;
            currCards = prevCards;
            prevCards = cloneCard(templateCards);
            container.prepend(...prevCards);

            currentIndex = currCards.length + currentIndex % currCards.length;
        }
        moveToCurrent();
    });

    function moveToCurrent() {
        console.log('Current index: ', currentIndex);
        if (currentIndex >= currCards.length) {
            nextCards[currentIndex % currCards.length].scrollIntoView({block:'nearest', inline:'start', behavior: 'smooth'});
        } else if (currentIndex < 0) {
            prevCards[currCards.length + currentIndex % currCards.length].scrollIntoView({inline:'start', behavior: 'smooth'});
        } else {
            currCards[currentIndex].scrollIntoView({block:'nearest', inline:'start', behavior: 'smooth'});
        }
    }

    button.addEventListener('click', () => {
        currentIndex++;
        moveToCurrent();
    });

    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        pressed = true;
        startX = e.clientX;
        x = container.scrollLeft;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {    
        if (pressed) {
            e.preventDefault();
            container.scrollLeft = x + startX - e.clientX;
        }
    });

    ['mouseup', 'mouseleave'].forEach(event => {
        container.addEventListener(event, () => {
            pressed = false;
            const distance = container.scrollLeft - x;
            const step = Math.ceil(Math.abs(distance) / cardWidth);
            if (distance > 0) {
                currentIndex += step;
            } else if (distance < 0) {
                currentIndex -= step;
            }
            moveToCurrent();
        });
    });
}

const toggleBtn = document.querySelector('body > header .toggle');
const navigation = document.querySelector('body > header nav');
toggleBtn.addEventListener('click', () => {
    navigation.classList.toggle('show');
    toggleBtn.classList.toggle('active');
});