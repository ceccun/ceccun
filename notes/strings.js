flsestrings["addnew"] = {
  default: "Add New",
  ja: "追加",
  it: "Inserisci",
  es: "Agregar",
  fr: "Ajouter",
  fi: "Lisää uusi",
};

flsestrings["notes"] = {
  default: "Notes",
  ja: "ノート",
  it: "Appunti",
  es: "Notas",
  fr: "Remarques",
  fi: "Muistiinpanot",
};

flsestrings["flashcards"] = {
  default: "Flashcards",
  ja: "カード",
  it: "Carte",
  es: "Tarjetas",
  fr: "Cartes",
  fi: "Muistikortit",
};

flsestrings["about"] = {
  default: "About",
  ja: "約",
  it: "Di",
  es: "Acerca de",
  fr: "À propos",
  fi: "Tietoa",
};

flsestrings["note-footer"] = {
  default: `<div class="note-footer-add-button">
                <img src="../images/new.svg" />
                <trn>
                    <div>
                        <p>Add</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-20px)" class="note-footer-button-context">
                  <p>Add New</p>
                  <div onclick="addTextElem('title')" class="button">Title</div>
                  <div class="button">Body</div>
                  <div class="button">Checkmark</div>
                  <div onclick="addTextElem('list')" class="button">List</div>
                </div>
            </div>

            <div class="note-footer-image-button">
                <img src="/images/image.svg" />
                <trn>
                    <div>
                        <p>Media</p>
                    </div>
                    <div></div>
                </trn>
            </div>

            <div class="note-footer-encrypt-button">
                <img onclick="encryptNote()" src="/images/unlocked_holo.svg" />
                <trn>
                    <div>
                        <p onclick="encryptNote()">Encryption</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-33px);" class="note-footer-button-context">
                  <p>This note is not encrypted.</p>
                  <div onclick="encryptNote()" class="button">Encrypt</div>
                </div>
            </div>

            <div class="note-footer-delete-button">
                <img onclick="deleteNote()" src="/images/delete.svg" />
                <trn>
                    <div>
                        <p onclick="deleteNote()">Remove</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-60px)" class="note-footer-button-context">
                  <p>Remove Note?</p>
                  <div onclick="deleteNote(2)" class="button">Remove</div>
                </div>
            </div>`,
  ja: `<div class="note-footer-add-button">
                <img src="../images/new.svg" />
                <trn>
                    <div>
                        <p>追加</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-20px)" class="note-footer-button-context">
                  <p>Add New</p>
                  <div onclick="addTextElem('title')" class="button">タイトル</div>
                  <div class="button">体</div>
                  <div class="button">チェックマーク</div>
                  <div onclick="addTextElem('list')" class="button">リスト</div>
                </div>
            </div>

            <div class="note-footer-image-button">
                <img src="/images/image.svg" />
                <trn>
                    <div>
                        <p>メディア</p>
                    </div>
                    <div></div>
                </trn>
            </div>

            <div class="note-footer-encrypt-button">
                <img onclick="encryptNote()" src="/images/unlocked_holo.svg" />
                <trn>
                    <div>
                        <p onclick="encryptNote()">暗号化</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-33px);" class="note-footer-button-context">
                  <p>このノートは暗号化されていません。</p>
                  <div onclick="encryptNote()" class="button">暗号化されて</div>
                </div>
            </div>

            <div class="note-footer-delete-button">
                <img onclick="deleteNote()" src="/images/delete.svg" />
                <trn>
                    <div>
                        <p onclick="deleteNote()">削除する</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-60px)" class="note-footer-button-context">
                  <p>メモを削除しますか？</p>
                  <div onclick="deleteNote(2)" class="button">削除する</div>
                </div>
            </div>`,
  zh_CN: `<div class="note-footer-add-button">
                <img src="../images/new.svg" />
                <trn>
                    <div>
                        <p>添加</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-20px)" class="note-footer-button-context">
                  <p>添新</p>
                  <div onclick="addTextElem('title')" class="button">标题</div>
                  <div class="button">身体</div>
                  <div class="button">复选标记</div>
                  <div onclick="addTextElem('list')" class="button">列表</div>
                </div>
            </div>

            <div class="note-footer-image-button">
                <img src="/images/image.svg" />
                <trn>
                    <div>
                        <p>媒体</p>
                    </div>
                    <div></div>
                </trn>
            </div>

            <div class="note-footer-delete-button">
                <img onclick="deleteNote()" src="/images/delete.svg" />
                <trn>
                    <div>
                        <p onclick="deleteNote()">消除</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-60px)" class="note-footer-button-context">
                  <p>删除注意？</p>
                  <div onclick="deleteNote(2)" class="button">消除</div>
                </div>
            </div>`,
};
