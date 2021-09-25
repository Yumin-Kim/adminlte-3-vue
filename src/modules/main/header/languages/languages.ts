import {Options, Vue} from 'vue-class-component';

@Options({})
export default class Languages extends Vue {
    private isDropdownOpened = false;

    public mounted(): void {
        document.addEventListener('click', this.documentClick);
    }

    public unmounted(): void {
        document.removeEventListener('click', this.documentClick);
    }

    private toggleDropdown() {
        this.isDropdownOpened = !this.isDropdownOpened;
    }

    private documentClick(event: Event) {
        const el: HTMLElement = this.$refs.dropdown as HTMLElement;
        const target: HTMLElement = event.target as HTMLElement;
        if (el !== target && !el.contains(target)) {
            this.isDropdownOpened = false;
        }
    }

    public changeLanguage(langCode: string) {
        if (this.$i18n.locale !== langCode) {
            this.$i18n.locale = langCode;
        }
    }
}
