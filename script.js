document.addEventListener('DOMContentLoaded', () => {
    // 1. Мобільне бургер-меню
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    burger.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('open'));
    });

    // 2. Модальне вікно запису
    const modal = document.getElementById('bookingModal');
    const modalDetails = document.getElementById('modalDetails');
    const openBtns = document.querySelectorAll('[data-modal-open]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');
    const serviceBtns = document.querySelectorAll('[data-service]');

    function openModal(prefillText = '') {
        modalDetails.value = prefillText;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    openBtns.forEach(btn => btn.addEventListener('click', () => openModal('')));
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    serviceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.getAttribute('data-service');
            openModal(`Цікавить послуга: ${serviceName}`);
        });
    });

// 3. Інтерактивний калькулятор вартості
    const carBtns = document.querySelectorAll('.car-btn');
    const serviceCards = document.querySelectorAll('#calcServices .checkbox-card');
    const summaryCar = document.getElementById('summaryCar');
    const summaryTime = document.getElementById('summaryTime');
    const summaryList = document.getElementById('summaryList');
    const summaryTotal = document.getElementById('summaryTotal');
    const bookCalcBtn = document.getElementById('bookCalcBtn');

    let currentMultiplier = 1;
    let currentCarName = 'Седан / Хетчбек';
    let lastCalculationSummary = '';

    // Допоміжна функція для округлення ціни до 50 грн
    function calcItemPrice(basePrice) {
        return Math.round((basePrice * currentMultiplier) / 50) * 50;
    }

    function updateCalculator() {
        let totalSum = 0;
        let totalHours = 0;
        const selectedItems = [];

        serviceCards.forEach(card => {
            const cb = card.querySelector('input[type="checkbox"]');
            const priceLabel = card.querySelector('.service-price-label');
            const basePrice = Number(cb.value);
            const updatedPrice = calcItemPrice(basePrice);

            // Оновлюємо ціну безпосередньо всередині кожної картки послуги
            priceLabel.textContent = `${updatedPrice.toLocaleString('uk-UA')} грн`;

            if (cb.checked) {
                totalSum += updatedPrice;
                totalHours += Number(cb.getAttribute('data-hours'));
                selectedItems.push({
                    name: cb.getAttribute('data-name'),
                    price: updatedPrice
                });
            }
        });

        summaryCar.textContent = currentCarName;
        summaryTime.textContent = totalHours > 0 ? `${totalHours} год` : '—';
        summaryTotal.textContent = `${totalSum.toLocaleString('uk-UA')} грн`;

        if (selectedItems.length > 0) {
            summaryList.innerHTML = selectedItems
                .map(item => `<div style="display: flex; justify-content: space-between; gap: 10px;"><span>• ${item.name}</span><strong>${item.price.toLocaleString('uk-UA')} грн</strong></div>`)
                .join('');

            const servicesText = selectedItems
                .map(item => `${item.name} (${item.price.toLocaleString('uk-UA')} грн)`)
                .join(', ');

            lastCalculationSummary = `Клас: ${currentCarName}\nПослуги: ${servicesText}\nОрієнтовна сума: ${totalSum.toLocaleString('uk-UA')} грн`;
        } else {
            summaryList.innerHTML = '<div>Оберіть хоча б одну послугу зліва</div>';
            lastCalculationSummary = `Клас: ${currentCarName}`;
        }
    }

    carBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            carBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMultiplier = Number(btn.getAttribute('data-multiplier'));
            currentCarName = btn.textContent;
            updateCalculator();
        });
    });

    serviceCards.forEach(card => {
        const cb = card.querySelector('input[type="checkbox"]');
        cb.addEventListener('change', updateCalculator);
    });

    bookCalcBtn.addEventListener('click', () => {
        openModal(lastCalculationSummary);
    });

    updateCalculator();

    // 4. Фільтрація робіт у портфоліо
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            workCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 5. FAQ Акордеон
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            faqItems.forEach(el => {
                el.classList.remove('open');
                el.querySelector('.faq-item__answer').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // 6. Обробка форм (демо-відправка)
    function handleFormSubmit(formId, statusId, isModal = false) {
        const form = document.getElementById(formId);
        const status = document.getElementById(statusId);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            status.textContent = 'Дякуємо! Вашу заявку прийнято, менеджер скоро зателефонує.';
            form.reset();

            if (isModal) {
                setTimeout(() => {
                    status.textContent = '';
                    closeModal();
                }, 1800);
            }
        });
    }

    handleFormSubmit('mainForm', 'mainFormStatus', false);
    handleFormSubmit('modalForm', 'modalFormStatus', true);
});