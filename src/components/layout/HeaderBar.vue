<template>
    <div class="sys-header">
        <div class="logo">
            <slot name="logo"></slot>
        </div>
        <slot name="topnav"></slot>


    </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {

    }
}
</script>
