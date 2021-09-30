import {
  Component,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';
import { AppConfig } from '@app/app.config';
import { CyncConstants } from '@cyncCommon/utils/constants';
declare var window: any;
declare var tinymce: any;

@Component({
  selector: 'app-cync-text-editor',
  templateUrl: './cync-text-editor.component.html',
  styleUrls: ['./cync-text-editor.component.css']
})
export class CyncTextEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() elementId: String;
  @Output() onEditorKeyup = new EventEmitter<any>();
  @Input() contentText: any;
  editor: any;
  assetsPath = CyncConstants.getAssetsPath();
  isContentDisabled = true;

  constructor(private config: AppConfig) {}

  ngOnInit() {}

  ngAfterViewInit() {
    let local_url='../../assets/vendors/tinymce/skins/lightgray';
    let assets_url=`${window.origin}/angular/assets/vendors/tinymce/skins/lightgray`;
    tinymce.init({
      selector: '#' + this.elementId,
      auto_focus: '#'+this.elementId,
      branding: false,
      plugins: ['link', 'paste', 'table', 'lists'],
      height: "200",
      skin_url: this.config.getEnvName()==='local' ? local_url: assets_url,
      menu: {
        edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
        view: { title: 'View', items: 'visualaid' },
        format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
        tools: { title: 'Tools', items: 'spellchecker code' },
        file: { title: 'File', items: 'newdocument' }
      },
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });
      }
    });

    if (this.contentText != undefined) tinymce.activeEditor.setContent(this.contentText);
  }

  ngOnDestroy() {
    tinymce.get(this.elementId).remove();
  }
 
  setEditorContent(content: any) {
    if (tinymce != null && tinymce.activeEditor != null){
      tinymce.activeEditor.setContent(content,{format:'row'});
      tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
    }
  }

  getEditorContent(): any {
    if (tinymce != null && tinymce.activeEditor != null){
       return tinymce.activeEditor.getContent(this.elementId);
    }
  }

  getEnableEditing() {
    if (tinymce != null && tinymce.activeEditor != null){
      this.isContentDisabled = false;
      tinymce.activeEditor.getBody().setAttribute('contenteditable', true);
    }
  }

  getDisableEditing() {
    if (tinymce != null && tinymce.activeEditor != null){
       tinymce.activeEditor.fire("focus");
       tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
    }
  }
}
