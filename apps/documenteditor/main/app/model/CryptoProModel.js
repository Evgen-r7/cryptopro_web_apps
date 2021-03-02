define([
	'backbone'
], function(Backbone){ 'use strict';

	DE.Models = DE.Models || {};

	DE.Models.CryptoProModel = Backbone.Model.extend({
		initialize: function() {  
		},
		defaults: {
			selectedIndex: -1,
			selectedId: '',
			list: []
		},
		getList: function() {
			let list = [];

			try {
				let res = JSON.parse(
					window.AscDesktopEditor.execCommand( 'kzn_unit', 
						JSON.stringify({ 
							'class': 'ds', 
							'method': 'get_list' 
						}))
				);
				if (res && res.error) {
					console.error(res.error);
				} else {
					list = this.parseInfo(res.data);
					list = this.transformList(list);
					// list.push(...tmpList);
				}
			} catch(err) {
				console.error(err);
			}
			// console.log('list', list);
			return list;
		},
		sign: function(signId) {
			if (!signId) return;
			
			const certInfo = this.getCertInfo(signId);
			if (!certInfo) {
				return;
			}

			function rmFile(path) {
				let req = JSON.stringify({
					"class": "fs",
					"method": "rm",
					"args": { 
						"file": path
					}
				})
				window.AscDesktopEditor.execCommand('kzn_unit', req);
			}

			function renameFile(fileIn, fileOut) {
				let req = JSON.stringify({
					"class": "fs",
					"method": "mv",
					"args": {
						"file_in": fileIn,
						"file_out": fileOut
					}
				});
				window.AscDesktopEditor.execCommand('kzn_unit', req);
			}

			function showStatus(status, isError, details) {
				new DE.Views.CryptoProDialog({
					txtTitle: 'Подпись документа',
					txtStatus: status,
					typeMsg: isError ? 'error' : 'success',
					details: details
				}).show();
			}

			let signDocument = async (file) => {
				let fileSig = file.replace(/.pdf$/, '-sig.pdf');

				return new Promise((resolve, reject) => {
					try {

						const serialNumber = certInfo.SerialNumber.replace(/^0x/, '').toLowerCase();
						const owner = certInfo.Subject.CN;
						const notBefore = this.parseUtcDate(certInfo.NotBefore).toLocaleString('ru-RU').split(',')[0];
						const notAfter = this.parseUtcDate(certInfo.NotAfter).toLocaleString('ru-RU').split(',')[0]

						const waterMark = `           ДОКУМЕНТ ПОДПИСАН\\n           ЭЛЕКТРОННОЙ ПОДПИСЬЮ\\nСертификат: ${serialNumber}\\nВладелец: ${owner}\\nДействителен: ${notBefore} до ${notAfter}`;

						// add Watermark
						let result = window.AscDesktopEditor.execCommand('kzn_unit', JSON.stringify({
							"class": "ds", 
							"method": "add_watermark_to_pdf",
							"args" : {
								"file": file,
								"text": window.btoa(unescape(encodeURIComponent(waterMark)))
							}
						}));
						// if exist error on step add watermark
						if (!result || (result && result.error)) {
							return reject(new Error(result && result.error));
						}

						// sign document
						let data = JSON.parse(window.AscDesktopEditor.execCommand('kzn_unit', 
							JSON.stringify(
								{ 
									"class": "ds", 
									"method": "sign", 
									"args": {
										"sign_info": certInfo, 
										"file_in": file,
										"file_out": fileSig
									}
								}
							)
						));

						// if exist error on step sign
						if (!data || (data && data.error)) {
							return reject(new Error(data && data.error));
						}
		
						// verify document
						setTimeout(() => {
							try {
								resolve(this.verify(file));
							} catch (err) {
								reject(err);
							}
						}, 1000);
		
					} catch (err) {
						reject(err);
					}
					rmFile(file);
					renameFile(fileSig, file);
				});
			}

			window.AscDesktopEditor.LocalFileSaveAs('saveas=true', "", "", 'PDFA File (*.pdf)', function (file) {
				if (!file) return;
				signDocument(file)
					.then((data) => {
						showStatus('Документ подписан!', false, data.details);
					}, (err) => {
						console.error('signDocument error', err);
						let details = { 'Документ': file };
						return showStatus('Произошла ошибка в процессе подписи документа!', true, details);
					});
			});
		},
		verify: function (path) {
			let status = JSON.parse(window.AscDesktopEditor.execCommand(
				'kzn_unit',
				JSON.stringify({
					"class" : "ds",
					"method": "verify",
					"args": {
						"file": path
					}
				})
			));

			if (!status || (status && status.error)) {
				throw new Error(status.error || 'Cryptopro: Couldnt get the verification result');
			}

			if (status.data && status.data.Subject && status.data.Issuer && status.data.SigningTime) {
				let list = this.parseInfo([status.data]);
				list = this.transformList(list);
				status['details'] = {
					'Документ': path,
					'Подписант': list[0].Subject.CN,
					'Центр': list[0].Issuer.CN,
					'Время подписи': this.parseUtcDate(list[0].SigningTime).toLocaleString('ru-RU'),
				}
			}

			return status;
		},
		transformList: function (list) {
			return list.map(x => {
				x.Issuer = this.parseSignRaw(x.Issuer);
				x.Subject = this.parseSignRaw(x.Subject);
				x.NotAfter = this.parseUtcDate(x.NotAfter);
				x.NotBefore = this.parseUtcDate(x.NotBefore);

				return x;
			});
		},
		parseInfo: function(list) {
			return list.map((i) => {
				i.Issuer = b64parse(i.Issuer);
				i.Subject = b64parse(i.Subject);

				function b64parse(str) {
					return atob(str).split('').map(x => {
						let c = x.charCodeAt();
						if (c >=192) { return c - 192 + 1040; }
						return c;
					}).map(c => String.fromCharCode(c)).join('')
				}
				return i;
			});
		},
		getCertInfo: function(id) {
			let certInfo = this.get('list').find((element) => (element.SerialNumber === id));
			return certInfo;
		},
		parseUtcDate: function (date) {
			const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) UTC$/;
			if (regex.test(date)) {
				return new Date(date.replace(regex, (_, p1, p2, p3, p4, p5, p6) => new Date(Date.UTC(+p3, +p2 - 1, +p1, +p4, +p5, +p6)).toISOString()));
			}
			date = new Date(date);
			if (!+date) {
				return new Date('0000-00-00');
			}
			return date;
		},
		parseSignRaw: function (raw) {
			return Object.fromEntries(
				raw
					.split(/^(?:([А-ЯA-Z]+)=)|(?:, ([А-ЯA-Z]+)=)/)
					.filter(Boolean)
					.reduce((p, n, i, a) => i % 2 === 0 ? p.concat([[n, a[i+1]]]) : p, [])
					.map(x => {
							x[1] = x[1].replace(/^"/, '').replace(/"$/, '');
						return x;
					}));
		}
	}, DE.Models.CryptoProModel || {});
});
