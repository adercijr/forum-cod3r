<template>
    <div class="stat">
        <div class="stat-icon">
            <i :class="icon" :style="style"></i>
        </div>
        <div class="stat-info">
            <span class="stat-title">{{ title }}</span>
            <span class="stat-value">{{ value }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Stat',
    props: ['title', 'value', 'icon', 'color'],
    computed: {
        style() {
            return "color: " + (this.color) || "#000"
        }
    }
}
</script>

<style>
    .stat {
        flex: 1; /* Aumenta de tamanho conforme o menu ativa e desativa */
        display: flex;
        border-radius: 8px;
        margin-top: 5px;
        margin-right: 20px;
        margin-bottom: 20px;
        background-color: #fff;
        padding: 20px;
        border: 2px solid rgba(0, 0,  0, 0.2);
        box-shadow: 0 1px 5px rgba(0, 0,  0, 0.15);

        transition: margin-top 0.35s;
    }  
    .stat:hover {
        margin-top: -10px;
         box-shadow: 0px 10px 10px rgba(0, 0,  0, 0.15);

    }  
    .stat-icon {
        display: flex;
        align-items: center;
    }
    .stat-icon i {
        font-size: 5rem;
        transition: font-size 0.1s;
    }
    .stat-icon i:hover {
        font-size: 6rem;
    }
    .stat-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
    }
    .stat-title {
        font-size: 1.2rem;
    }
    .stat-value {
        font-size: 3rem;
    }
</style>