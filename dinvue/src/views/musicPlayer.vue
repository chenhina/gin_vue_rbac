<template>
    <div>
        <div style="width: 100%">
            <APlayer :audio="audio"></APlayer>
        </div>
    </div>
</template>

<script>
    import { APlayer } from '@moefe/vue-aplayer';
    export default {
        name: "musicPlayer",
        components:{
            APlayer
        },
        data(){
            return {
                audio :[
                    {
                        name: '与君赴江湖',
                        artist: '群像',
                        url: 'http://music.163.com/song/media/outer/url?id=1856788344.mp3',
                        cover: 'https://p1.music.126.net/Bcmvtju4hIpj3VlG5H1wig==/109951166126228186.jpg?param=300y300', // prettier-ignore
                        lrc: 'https://cdn.moefe.org/music/lrc/thing.lrc',
                    },
                    {
                        name: '惊鹊',
                        artist: '三无/Hanser',
                        url: 'http://music.163.com/song/media/outer/url?id=1842060397.mp3',
                        cover: 'https://p1.music.126.net/5x4CuTuMusDXdXer4aLMKQ==/109951165929087605.jpg?param=300y300', // prettier-ignore
                        lrc: 'https://cdn.moefe.org/music/lrc/kyoukiranbu.lrc',
                    },
                    {
                        name: '易安难安',
                        artist: '赤羽',
                        url: 'http://music.163.com/song/media/outer/url?id=1835290997.mp3',
                        cover: 'https://p2.music.126.net/MfXONYDZaCBQUddcjRsMjQ==/109951165867525158.jpg?param=300y300', // prettier-ignore
                        lrc: 'https://cdn.moefe.org/music/lrc/kiss.lrc',
                    },
                ]
            }
        }
    }
</script>

<style scoped>

</style>
