<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand :href="brand.url">{{brand.title}}</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item v-for="link in links" :key="link.url" :href="link.url">{{link.title}}</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>
<script>
    import Vue from "vue";
    import BootstrapVue from "bootstrap-vue";

    Vue.use(BootstrapVue);

    export default {
        data() {
            return {
                brand: {
                    url: "/",
                    title: "Mark Down Editor"
                },
                links: [{
                    url: "/",
                    title: "Home"
                }]
            };
        }
    };
</script>