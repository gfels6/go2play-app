<template>
  <Page class="page">
    <ActionBar title="Einstellungen">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

      <StackLayout orientation="horizontal" class="nix">
      
        <StackLayout :class="[{ active: isMaleActive }, 'btn-img']" ref='layoutMale' orientation="vertical" padding="10" @tap="onTappedGender('male')" >
            <Image src="~/assets/images/male.png" />
            <Label text="Männlich" verticalAlignment="center"></Label>
        </StackLayout>

        <StackLayout :class="[{ active: isFemaleActive }, 'btn-img']" ref='layoutFemale' orientation="vertical" padding="10" @tap="onTappedGender('female')" >
            <Image src="~/assets/images/female.png" />
            <Label text="Männlich" verticalAlignment="center"></Label>
        </StackLayout>
      </StackLayout>

    </StackLayout>
  </Page>
</template>

<script>
    export default {
        data: function() {
            return {
                isMaleActive: false,
                isFemaleActive: false
            };
        },
        name: 'settings-view',
        methods: {
            onTappedGender(gender){
                //console.log(gender);
                if (gender == "male") {
                    this.isMaleActive = true;
                    this.isFemaleActive = false;
                } else {
                    this.isMaleActive = false;
                    this.isFemaleActive = true;
                }
                console.log(this.isMaleActive);
            }
        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }
    .btn-img{
        border-radius: 5;
        border-width: 1;
        color: white;
        margin: 10;
        font-size: 22;
        border-color: #2b3c6a;
        height: 80;
        width: 80;
    }

    .active{
        background-color: rgb(0, 255, 106);
    }
</style>