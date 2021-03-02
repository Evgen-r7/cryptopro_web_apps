define([], function () { 'use strict';
	DE.Views.CryptoProDialog = Common.UI.Window.extend(_.extend({
		applyFunction: void 0,

		initialize: function(options) {
			// console.log('Init options.details', options.details)
			this.txtTitle = options.txtTitle;
			this.txtStatus = options.txtStatus;
			this.details = options.details;
			this.typeMsg = options.typeMsg;
			let rowHeightPx = 19;
			let height = 128;
			if (this.details) {
				let count = Object.keys(this.details).length;
				if (count == 1) height += 12;
				height += (count * rowHeightPx);
			}

			let obj = {};
			_.extend(obj, {
					width: 450,
					header: !0,
					height: height,
					cls: "modal-dlg",
					title: this.txtTitle,
					details: this.details
			}, options),

			this.template = `
			<style>
				.box-row {
					display: flex;
					flex-wrap: wrap;
					margin: 0 -10px;
				}
			
				.box-col {
					display: block;
					padding: 0 10px;
				}
			
				.box-col-6 {
					flex: 0 0 50%;
					max-width: 50%;
				}
			
				.box-col-3 {
					flex: 0 0 33%;
					max-width: 33%;
				}
			
				.box-col-12 {
					flex: 0 0 100%;
					max-width: 100%;
				}
			
				.mb-1 {
					margin-bottom: 10px;
				}
			
				.box-button {
					display: block;
					width: 100%;
					height: 50px;
				}
			
				.textCenter {
					text-align: center;
				}

				.cryptopro-details {
					margin-left: 30px;
				}
			</style>
			
			<div class="box">

				<div>
					<div class="box-row">
						<div class="box-col box-col-12 mb-1">
							<img style="display:none; margin-right:10px;" id="cryptopro-img-error" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTggMWE3IDcgMCAxMC4wMDEgMTQuMDAxQTcgNyAwIDAwOCAxem0yLjU4NCA5LjY2bC0xLjAzLS4wMDVMOCA4LjgwM2wtMS41NTIgMS44NS0xLjAzMi4wMDVhLjEyNC4xMjQgMCAwMS0uMTI1LS4xMjVjMC0uMDMuMDEtLjA1OC4wMy0uMDgxTDcuMzUyIDguMDMgNS4zMiA1LjYxYS4xMjUuMTI1IDAgMDEuMDk1LS4yMDZsMS4wMzMuMDA0TDggNy4yNTlsMS41NTItMS44NSAxLjAzLS4wMDRjLjA3IDAgLjEyNi4wNTQuMTI2LjEyNWEuMTMuMTMgMCAwMS0uMDMuMDhsLTIuMDMgMi40MjEgMi4wMzIgMi40MjJhLjEyNS4xMjUgMCAwMS0uMDk1LjIwNnoiIGZpbGw9IiNGNTNGMTUiLz48L3N2Zz4=">

							<img style="display:none; margin-right:10px;" id="cryptopro-img-success" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTggMWE3IDcgMCAxMC4wMDEgMTQuMDAxQTcgNyAwIDAwOCAxem0zLjAyMyA0LjcxNGwtMy4yOSA0LjU2M2EuNDk2LjQ5NiAwIDAxLS44MDggMGwtMS45NDgtMi43YS4xMjUuMTI1IDAgMDEuMTAxLS4xOTloLjczM2EuNS41IDAgMDEuNDA1LjIwOEw3LjMyOCA5LjEzbDIuNDU2LTMuNDA3YS41LjUgMCAwMS40MDUtLjIwN2guNzMzYy4xMDEgMCAuMTYuMTE1LjEwMS4xOTh6IiBmaWxsPSIjNUI5RjI3Ii8+PC9zdmc+">

							<strong style="vertical-align:middle">${this.txtStatus}</strong>
							<div id="cryptopro-details" class="cryptopro-details"></div>
						</div>
						<div class="box-col box-col-3">
						</div>
						<div class="box-col box-col-3">
							
						</div>
						<div class="box-col box-col-3">
						</div>
					</div>
				</div>

				<div class="footer right">
						<button class="btn normal dlg-btn primary" result="ok">${this.txtOk}</button>
				</div>
			</div>`,

			this.api = this.api;
			this.handler = options.handler;
			this.settings = options.settings;
			obj.tpl = _.template(this.template)(obj);
			Common.UI.Window.prototype.initialize.call(this, obj);
		},

		render: function(t) {
			Common.UI.Window.prototype.render.call(this);
			let $window = this.getChild();

			let detailsHtml = '';

			if (this.details) {
				detailsHtml = '<br>';
				for (let key in this.details) {
					detailsHtml += `<div>${key}: ${this.details[key]}</div>`;
				}
			}
			$window.findById(`#cryptopro-details`).html(detailsHtml);

			$window.findById(`#cryptopro-img-${this.typeMsg}`).show();
			$window.find('.dlg-btn').on('click', _.bind(this.onBtnClick, this));
		},

		onBtnClick: function(event) {
				this._handleInput(event.currentTarget.attributes['result'].value);
		},

		_handleInput: function(state) {
				if (this.options.handler)
						this.options.handler.call(this, this, state);
				this.close();
		},

		show: function() {
				Common.UI.Window.prototype.show.apply(this, arguments);
		},

		txtOk: 'Ok'

	}, DE.Views.CryptoProDialog || {}))
});