'use strict';

import Adw from 'gi://Adap?version=1';
import GObject from 'gi://GObject?version=2.0';
import Gtk from 'gi://Gtk?version=4.0';
import Pango from 'gi://Pango?version=1.0';

/**
 * A list row that looks and behaves like a button.
 * Stand-in for Adw.ButtonRow, which libadapta doesn't have.
 */
export const ButtonRow = GObject.registerClass(
	{
		GTypeName: 'DosageButtonRow',
		Properties: {
			'start-icon-name': GObject.ParamSpec.string(
				'start-icon-name',
				null,
				null,
				GObject.ParamFlags.READWRITE,
				null,
			),
			'end-icon-name': GObject.ParamSpec.string(
				'end-icon-name',
				null,
				null,
				GObject.ParamFlags.READWRITE,
				null,
			),
		},
		Signals: {
			activated: {},
		},
	},
	class ButtonRow extends Adw.PreferencesRow {
		constructor(params = {}) {
			super(params);
			this.add_css_class('button-row');

			const box = new Gtk.Box({
				halign: Gtk.Align.CENTER,
				spacing: 6,
			});
			const startImage = new Gtk.Image({ accessible_role: Gtk.AccessibleRole.PRESENTATION });
			const label = new Gtk.Label({ ellipsize: Pango.EllipsizeMode.END });
			const endImage = new Gtk.Image({ accessible_role: Gtk.AccessibleRole.PRESENTATION });

			const flags = GObject.BindingFlags.SYNC_CREATE;
			const hasIcon = (_binding, iconName) => [true, !!iconName];
			this.bind_property('start-icon-name', startImage, 'icon-name', flags);
			this.bind_property_full('start-icon-name', startImage, 'visible', flags, hasIcon, null);
			this.bind_property('title', label, 'label', flags);
			this.bind_property('end-icon-name', endImage, 'icon-name', flags);
			this.bind_property_full('end-icon-name', endImage, 'visible', flags, hasIcon, null);

			box.append(startImage);
			box.append(label);
			box.append(endImage);
			this.set_child(box);
		}

		vfunc_root() {
			super.vfunc_root();

			if (this.parent instanceof Gtk.ListBox) {
				this._listBox = this.parent;
				this._rowActivatedId = this._listBox.connect('row-activated', (_listBox, row) => {
					if (row === this) this.emit('activated');
				});
			}
		}

		vfunc_unroot() {
			this._listBox?.disconnect(this._rowActivatedId);
			this._listBox = null;

			super.vfunc_unroot();
		}
	},
);
