<script setup>
import { ref } from 'vue';

const cards = ref([
    {
        title: 'Vue 3 ile Hızlı Başlangıç',
        content: 'Vue 3’ün temel özellikleri ve kullanımına dair detaylı rehberVue 3’ün temel özellikleri ve kullanımına dair detaylı rehberVue 3’ün temel özellikleri ve kullanımına dair detaylı rehberVue 3’ün temel özellikleri ve kullanımına dair detaylı rehberVue 3’ün temel özellikleri ve kullanımına dair detaylı rehberVue 3’ün temel özellikleri ve kullanımına dair detaylı rehberVue 3’ün temel özellikleri ve kullanımına dair detaylı rehberVue 3’ün temel özellikleri ve kullanımına dair detaylı rehberVue 3’ün temel özellikleri ve kullanımına dair detaylı rehber.',
        image: '/demo/images/logo.svg'
    },
    {
        title: 'PrimeVue Bileşenleri',
        content: 'PrimeVue ile harika UI bileşenleri oluşturun ve projelerinizi hızlandırın.',
        image: '/demo/images/logo.svg'
    },
    {
        title: 'State Management',
        content: 'Vuex ve Pinia kullanarak Vue 3’te state yönetimini nasıl sağlayabilirsiniz?',
        image: '/demo/images/logo.svg'
    },
    {
        title: 'Vue Router Kullanımı',
        content: 'Vue Router ile sayfa yönlendirmesi ve çoklu sayfa uygulamaları oluşturma yöntemleri.',
        image: '/demo/images/logo.svg'
    },
    {
        title: 'Vue Router Kullanımı',
        content: 'Vue Router ile sayfa yönlendirmesi ve çoklu sayfa uygulamaları oluşturma yöntemleri.',
        image: '/demo/images/logo.svg'
    },
    {
        title: 'Vue Router Kullanımı',
        content: 'Vue Router ile sayfa yönlendirmesi ve çoklu sayfa uygulamaları oluşturma yöntemleri.',
        image: '/demo/images/logo.svg'
    }
]);

const videos = ref([
    { id: 'Xn7KWR9EOGQ', title: 'Vue 3 Tutorial' },
    { id: 'cH5YtJw2L8I', title: 'PrimeVue Components' },
    { id: 'dQw4w9WgXcQ', title: 'Best Coding Practices' }
]);

const carouselResponsiveOptions = ref([
    { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
    { breakpoint: '768px', numVisible: 2, numScroll: 2 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
]);
</script>

<template>
    <div class="grid-container">
        <div class="cards-container">
            <h2 class="section-title">Biz Kimiz</h2>
            <div class="grid">
                <div v-for="(card, index) in cards" :key="index" class="card">
                    <img :src="card.image" alt="Card Image" class="card-image">
                    <div class="card-text">
                        <h3 class="card-title">{{ card.title }}</h3>
                        <p class="card-description">{{ card.content }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="youtube-section">
            <div class="font-semibold text-xl mb-4">YouTube Videolarımız</div>
            <Carousel :value="videos" :numVisible="3" :numScroll="3" :responsiveOptions="carouselResponsiveOptions">
                <template #item="slotProps">
                    <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">
                        <div class="mb-4">
                            <div class="relative mx-auto">
                                <iframe
                                    :src="'https://www.youtube.com/embed/' + slotProps.data.id"
                                    class="w-full h-48 rounded"
                                    frameborder="0"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </div>
                        <div class="mb-4 font-medium text-center">{{ slotProps.data.title }}</div>
                    </div>
                </template>
            </Carousel>
        </div>
    </div>
</template>

<style scoped lang="scss">
.grid-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
}

.cards-container {
    text-align: center;
    width: 100%;
    max-width: 1300px;
    padding: 2rem;
    border: 2px solid #ddd; /* Çerçeve eklendi */
    border-radius: 8px; /* Kenarları yuvarlatmak için */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Hafif gölge */
    background-color: #f9f9f9; /* Arka plan rengi */
}

.section-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
}

.grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
}

.card {
    display: flex;
    align-items: center;
    width: 100%;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
    gap: 1rem;
}

.card-image {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
}

.card-text {
    flex: 1;
}

.card-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.card-description {
    font-size: 0.9rem;
    color: #555;
}

.youtube-section {
    margin-top: 2rem;
}
</style>



