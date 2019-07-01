<template>
  <section class="container">
    <div class="row">
      <div class="col">
        <b-form>
          <div>
            <label for="title">Title</label>
            <b-form-input id="title" v-model="title"></b-form-input>
          </div>
          <div>
            <label for="contents">Contents</label>
            <b-form-textarea id="contents" v-model="contents" rows="10"></b-form-textarea>
          </div>
          <b-form-file id="file" v-on:change="importFile"></b-form-file>
          <div>
            <b-button variant="primary" v-on:click="save">Save</b-button>
            <b-button variant="primary" v-on:click="clear">Clear</b-button>
          </div>
        </b-form>
      </div>
      <div class="col" v-html="html"></div>
    </div>
  </section>
</template>
<style>
  pre {
    background-color: rgb(54, 69, 73);
    color: rgb(227, 227, 227);
  }
</style>
<script lang="ts">
import Vue from 'vue';
import Marked from 'marked';
import Encoding from 'encoding-japanese';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { scrypt } from 'crypto';

Vue.use(BootstrapVue);

export default Vue.extend({
  data() {
    return {
      title: '',
      contents: '',
    };
  },
  computed: {
    markdown(): string {
      let result = '';

      if (!this.isEmpty(this.title) && !this.isEmpty(this.contents)) {
        result = `# ${this.title}\n${this.contents}`;
      }

      return result;
    },
    html(): string {
      let result = '';

      if (!this.isEmpty(this.markdown)) {
        const renderer = new Marked.Renderer();

        renderer.table = (header: string, body: string) => {
          const table = `
          <table class="table table-bordered table-hover">
              <thead class="thead-dark">
                  ${header}
              </thead>
              <tbody>
                  ${body}
              </tbody>
          </table>`;

          return table;
        };

        result = Marked(this.markdown, { sanitize: true, renderer });
      }

      return result;
    },
  },
  methods: {
    clear() {
      this.title = '';
      this.contents = '';
    },
    isEmpty(value: string): boolean {
      let result = false;

      if (value === null || value === '') {
        result = true;
      }

      return result;
    },
    getMdBlob() {
      const pattern = /\n/g;

      const blob = new Blob([this.markdown.replace(pattern, '\r\n')], {
        type: 'text/plain',
      });

      return blob;
    },
    getHtmlBlob() {
      const html = document.createElement('html');

      const head: HTMLHtmlElement = document.head.cloneNode(
        true,
      ) as HTMLHtmlElement;
      const title = head.getElementsByTagName('title');
      title[0].textContent = this.title;

      html.appendChild(head);

      const body = document.createElement('body');
      body.innerHTML = this.html;

      html.appendChild(body);

      const link = html.querySelectorAll('link');

      for (const element of link) {
        element.remove();
      }

      const script = html.querySelectorAll('script');

      for (const element of script) {
        element.remove();
      }

      const htmlOutput = html.innerHTML;
      const blob = new Blob([htmlOutput], { type: 'text/html' });

      return blob;
    },
    exportFile(blob: Blob, fileName: string) {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.target = '_blank';
      anchor.download = fileName;

      anchor.click();
      URL.revokeObjectURL(url);
    },
    save() {
      if (this.isEmpty(this.title)) {
        window.alert('Title を入力してください。');
        return;
      }

      if (this.isEmpty(this.contents)) {
        window.alert('Contents を入力してください。');
        return;
      }

      const pattern = /\\|\/|:|\*|\?|"|<|>|\||#/g;

      if (pattern.test(this.title)) {
        window.alert('Title に \\ / : * ? " < > | # は使用できません。');
        return;
      }

      const md = this.getMdBlob();
      const html = this.getHtmlBlob();
      this.exportFile(md, this.title + '.txt');
      this.exportFile(html, this.title + '.html');
    },
    readFile(file: Blob, output: object) {
      const reader = new FileReader();

      reader.addEventListener('load', (e) => {
        let result: object = new Uint8Array(e.target.result);

        switch (Encoding.detect(result)) {
          case 'UTF16':
            result = new Uint16Array(e.target.result);
            break;
          case 'UTF32':
            result = new Uint32Array(e.target.result);
            break;
        }

        const fileName = file.name.replace('.txt', '');
        const pattern = new RegExp(`# ${fileName}\r\n|# ${fileName}\n`);

        const converted = Encoding.convert(result, 'UNICODE');
        const contents = Encoding.codeToString(converted);

        output.title = fileName;
        output.contents = contents.replace(pattern, '');
      });

      reader.readAsArrayBuffer(file);
    },
    importFile(e: ProgressEvent) {
      const file = e.target.files[0];
      const pattern = /\.txt/;

      if (!pattern.test(file.name)) {
        window.alert('.txt ファイルを指定してください。');
        return;
      }

      this.readFile(file, this);
    },
  },
});
</script>
