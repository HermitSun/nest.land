<template>
  <div class="not-found">
    <div class="hero is-light is-fullheight nest-footprints-hero">
      <div class="hero-head">
        <nest-nav />
      </div>
      <div class="hero-body">
        <div class="container">
          <img :src="notFoundIcon" class="not-found-icon" alt="not found icon" />
          <h1 class="title is-1 has-text-centered">404</h1>
          <p class="subtitle has-text-centered">
            This is not the page you're looking for.
            <br />Maybe try our
            <a href="https://docs.nest.land">documentation</a>?
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import notFoundIcon from "../assets/nest_question.png";
  import NestNav from "../components/Nav";

  export default {
    name: "NotFound",
    components: {
      NestNav,
    },
    computed: {
      notFoundIcon: () => notFoundIcon,
    },
  };
</script>

<style lang="sass" scoped>

  img.not-found-icon
    height: 75px
    margin: 0 auto 20px
    display: block

  p.subtitle
    text-shadow: -1px 9px 8px rgba(50, 50, 93, 0.12), 0 5px 15px rgba(0, 0, 0, 0.18)

  a
    color: #00947e !important
    text-shadow: -1px 9px 8px rgba(0, 148, 126, 0.12), 0 5px 15px rgba(0, 148, 126, 0.18)

</style>