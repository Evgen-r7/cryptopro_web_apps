define([], function () { 'use strict';
	DE.Views.CryptoProSign = Common.UI.Window.extend(_.extend({
		applyFunction: void 0,

		initialize: function(options) {
			let obj = {};

			_.extend(obj, {
					width: 600,
					height: 425,
					header: !0,
					cls: "modal-dlg",
					contentTemplate: "",
					title: this.txtTitle,
			}, options)
			
			this.template = `
	<style>
	.screen-active {
		display: block;
	}
	.screen-inactive {
		display: none;
	}
	.box-row {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10px;
	}
	.box-row > * {
		display: block;
		padding: 0 10px;
	}
	.box-col {flex:1 0 0%}
	.box-col-auto {flex:0 0 auto;width:auto}
	.box-col-3 {flex:0 0 25%;max-width:25%}
	.box-col-4 {flex:0 0 33.33333333333333%;max-width:33.33333333333333%}
	.box-col-5 {flex:0 0 41.66666666666667%;max-width:41.66666666666667%}
	.box-col-6 {flex:0 0 50%;max-width:50%}
	.box-col-7 {flex:0 0 58.333333333333333%;max-width:58.333333333333333%}
	.box-col-8 {flex:0 0 66.66666666666667%;max-width:66.66666666666667%}
	.box-col-9 {flex:0 0 75%;max-width:75%}
	.box-col-12 {flex:0 0 100%;max-width:100%}
	.mb-1 {margin-bottom: 10px}
	.mb-2 {margin-bottom: 20px}
	.box-button {
		display: block;
		width: 100%;
		height: 50px;
	}
	.textCenter {
		text-align: center;
	}
	.selectSign {
		background-color: #97bdde !important;
	}
	.deactivateBtn {
		opacity: .5;
	}

	#cryproprosign-search {
		-webkit-apperance: none;
		apperance: none;
		border: 1px solid #CBCBCB;
		box-sizing: border-box;
		border-radius: 2px;
		padding: 0 6px;
		margin: 0 0 8px;
		font-size: 11px;
		line-height: 22px;
		width: 100%;
	}

	.cryproprosign-info-title {
		font-weight: 700;
		font-size: 11px;
		line-height: 22px;
		color: #444444;
		margin: 0 0 8px;
	}

	#cryptoprosign-listbox {
		box-sizing: border-box;
		position:relative;
	}
	#cryptoprosign-listbox .cryptoprosign-list {
		border: 1px solid #CBCBCB;
		box-sizing: border-box;
		border-radius: 1px;
		height: 294px;
		overflow-x: hidden;
		overflow-y: auto;
	}
	#cryptoprosign-listbox .cryptoprosign-noresults {
		left:50%;
		top:50%;
		transform: translate(-50%, -50%);
		position:absolute;
		text-align:center;
		color: #7D858C;
	}
	#cryptoprosign-listbox .cryptoprosign-noresults .cryptoprosign-noresults-title {
		font-weight: 700;
		font-size: 12px;
		line-height: 15px;
		text-align: center;
		margin-bottom: 4px;
	}
	#cryptoprosign-listbox .cryptoprosign-noresults .cryptoprosign-noresults-desc {
		font-size: 11px;
		line-height: 14px;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item {
		display: block;
		background-color: #fff;
		border-bottom: 1px solid #CBCBCB;
		padding: 4px 6px 4px 16px;
		position:relative;
		cursor: pointer;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-selected {
		background-color: #7D858C;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item::after {
		position: absolute;
		width: 6px;
		height: 6px;
		left: 6px;
		top: 9px;
		content: '';
		display: block;
		border-radius: 50%;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-active::after {
		background-color: #85CD4E;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-inactive::after {
		background-color: #F53F15;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-subject {
		font-weight: 700;
		font-size: 11px;
		line-height: 15px;
		color: #444444;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-issuer {
		font-size: 11px;
		line-height: 15px;
		color: #7D858C;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-inactive .cryptoprosign-subject {
		color: rgba(68, 68, 68, 0.64);
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-inactive .cryptoprosign-issuer {
		color: rgba(125, 133, 140, 0.64);
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-selected .cryptoprosign-subject,
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-selected .cryptoprosign-issuer {
		color: #fff;
	}
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-selected.cryptoprosign-inactive .cryptoprosign-subject,
	#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item.cryptoprosign-selected.cryptoprosign-inactive .cryptoprosign-issuer {
		color: rgba(255, 255, 255, 0.78);
	}

	#cryptoprosign-info dl {
		padding: 0;
		margin: 0 0 6px;
		font-size: 11px;
		line-height: 15px;
		overflow-wrap: break-word;
	}
	#cryptoprosign-info span {
		font-size: 11px;
		line-height: 15px;
		color: #7D858C;
		display: none;
	}
	#cryptoprosign-info.cryptoprosign-noresult dl {
		display: none;
	}
	#cryptoprosign-info.cryptoprosign-noresult span {
		display: block;
	}
	#cryptoprosign-info dl dt {
		font-weight: 700;
		color: #7D858C;
	}
	#cryptoprosign-info dl dd {
		color: #444444;
	}
	</style>
	<div class="box">
		<div class="box-row">
			<div class="box-col-7">
				<input type="text" id="cryproprosign-search" placeholder="Поиск по списку сертификатов" />
				<div id="cryptoprosign-listbox">
					<div class="cryptoprosign-list"></div>
					<div class="cryptoprosign-noresults">
						<div class="cryptoprosign-noresults-title">Нет результатов</div>
						<div class="cryptoprosign-noresults-desc">Повторите попытку</div>
					</div>
				</div>
			</div>
			<div class="box-col-5">
				<div class="cryproprosign-info-title">Сведения о сертификате</div>
				<div id="cryptoprosign-info">
					<span>Сертификат не выбран</span>
					<dl><dt>Статус</dt><dd>Нет данных</dd></dl>
					<dl><dt>Владелец сертификата</dt><dd>Нет данных</dd></dl>
					<dl><dt>Организация</dt><dd>Нет данных</dd></dl>
					<dl><dt>Издатель</dt><dd>Нет данных</dd></dl>
					<dl><dt>Выдан</dt><dd>Нет данных</dd></dl>
					<dl><dt>Годен до</dt><dd>Нет данных</dd></dl>
					<dl><dt>Серийный номер</dt><dd>Нет данных</dd></dl>
				</div>
			</div>
		</div>
		<div class="footer right">
			<button class="btn normal dlg-btn" result="cancel">${this.txtCancel}</button>
			<button class="btn normal dlg-btn primary" id="cryptoprosign-sign" result="sign" disabled>${this.txtSign}</button>
		</div>
	</div>`;

			this.handler = options.handler;
			this.settings = options.settings;
			obj.tpl = _.template(this.template)(obj);
			Common.UI.Window.prototype.initialize.call(this, obj);
		},
		render: function(t) {
			Common.UI.Window.prototype.render.call(this);
			this.addSignatureList();
			this.showDetailCert();

			let $window = this.getChild();
			$window.find('.dlg-btn').on('click', _.bind(this.onBtnClick, this));
			this.subscribeEvents();
		},
		search: function (searchText) {
			var list = this.model.get('list');
			return list.filter((x) => (x.Subject['CN'] && x.Subject['CN'].toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) || (x.Issuer['CN'] && x.Issuer['CN'].toLocaleLowerCase().includes(searchText.toLocaleLowerCase())));
		},
		show: function() {
				Common.UI.Window.prototype.show.apply(this, arguments);
				var t = this;
		},
		renderList: function (list) {
			this.model.set('selectedIndex', -1);
			this.model.set('selectedId', '');
			$('#cryptoprosign-sign').attr('disabled', '');
			this.showDetailCert();
			$('#cryptoprosign-listbox .cryptoprosign-list').empty();

			if (list.length) {
				$('#cryptoprosign-listbox .cryptoprosign-noresults').hide();
			}

			list.forEach((item) => {
				$('#cryptoprosign-listbox .cryptoprosign-list')
					.append(`<div id="${item.SerialNumber}" class="cryptoprosign-item ${+item.NotAfter > Date.now() ? 'cryptoprosign-active' : 'cryptoprosign-inactive'}"><div class="cryptoprosign-subject">${item.Subject['CN']}</div><div class="cryptoprosign-issuer">${item.Issuer['CN']}</div><div></div></div>`);
			});
		},
		showDetailCert: function(el) {
			const $dls = $('#cryptoprosign-info dl');
			for (let i = 0; i < $dls.length; i++) {
				$($dls[i]).find('dd').html('Нет данных');
			}
			if (el) {
				$('#cryptoprosign-info').removeClass('cryptoprosign-noresult');
				$($dls[0]).find('dd').html(+el.NotAfter > Date.now() ? '<strong style="color:#5B9F27">Сертификат валиден</strong>' : '<strong style="color:#F53F15">Сертификат невалиден</strong>');
				$($dls[1]).find('dd').text(el.Subject['CN']);
				$($dls[2]).find('dd').text(el.Subject['O']);
				$($dls[3]).find('dd').text(el.Issuer['CN']);
				$($dls[4]).find('dd').text(el.NotBefore.toLocaleString('ru-RU'));
				$($dls[5]).find('dd').text(el.NotAfter.toLocaleString('ru-RU'));
				$($dls[6]).find('dd').text(el.SerialNumber.replace(/^0x/, ''));

				// <dl><dt>Алгоритм подписи</dt><dd>Нет данных</dd></dl>
				// <dl><dt>Хэш алгоритм подписи</dt><dd>Нет данных</dd></dl>
				// $(dls[6]).find('dd').text(el.Alhorithm);
				// $(dls[7]).find('dd').text(el.AlhorithmHash);
			} else {
				$('#cryptoprosign-info').addClass('cryptoprosign-noresult');
			}
		},
		subscribeEvents: function () {
			let model = this.model;
			let self = this;

			$('#cryptoprosign-listbox .cryptoprosign-list').on('click', '.cryptoprosign-item', function () {
				const $el = $('#cryptoprosign-listbox .cryptoprosign-list .cryptoprosign-item');
				$el.removeClass('cryptoprosign-selected');
				let selectedIndex = model.get('selectedIndex');
				model.set('selectedId', '');

				for (let i = 0, el = $el[i]; i < $el.length; el = $el[++i]) {
					if (el === this) {
						if (selectedIndex !== i) {
							$(this).addClass('cryptoprosign-selected');
							model.set('selectedId', this.id);
							selectedIndex = i;
						} else {
							selectedIndex = -1;
						}
						model.set('selectedIndex', selectedIndex);
						break;
					}
				}
				const cert = model.getCertInfo(model.get('selectedId'));
				self.showDetailCert(cert);
				if (cert && +cert.NotAfter > Date.now()) {
					$('#cryptoprosign-sign').removeAttr('disabled');
				} else {
					$('#cryptoprosign-sign').attr('disabled', '');
				}
				
			});

			const $search = $('#cryproprosign-search');
			$search.on('input change', () => {
				const v = $search.val();
				this.renderList(this.search(v));
			});
		},
		addSignatureList: function() {
			const sourceList = this.model.getList();
			this.model.set('list', sourceList);
			this.renderList(sourceList);
		},
		onBtnClick: function(event) {
				this._handleInput(event.currentTarget.attributes['result'].value);
		},
		_handleInput: function(state) {
			if (state == 'sign') this.model.sign(this.model.get('selectedId'));
			this.model.destroy();
			this.close();
		},
		txtTitle: "КриптоПро",
		txtSign: "Подписать",
		txtVerify: "Проверить",
		txtCancel: 'Отмена',
		txtOk: 'Ok'
	}, DE.Views.CryproProSign || {}))
});