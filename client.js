/**
 * Worktable — browser half.
 *
 * Adds a first-level Worktable pane below the Workspaces region in the left
 * sidebar. The pane is registered at `sidebar.footer.action` (the only list
 * seat below the Workspaces region), then lifted out of the sidebar foot with
 * `display: contents` on its two host containers. That makes the pane a layout
 * sibling of the Workspaces region, so the two take an equal share of the
 * sidebar body instead of sharing a footer row.
 *
 * The pane has a static header (localized title + add button) and an always
 * visible list; with no Worktables yet the list area shows the localized
 * "Empty" placeholder. Copy follows the Harness language setting.
 */
window.__ModuleLoader__.load({
  id: 'dsh-worktable',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    const React = require('react');
    const h = React.createElement;

    /** Locale namespace owned by this plugin. */
    const NS = 'dsh-worktable';

    /** Simplified Chinese dictionary (the key-set source of truth). */
    const zh = {
      title: '工作台',
      add: '添加工作台',
      empty: '空',
    };

    /** English dictionary, checked complete against the zh key set. */
    const en = {
      title: 'Worktable',
      add: 'Add worktable',
      empty: 'Empty',
    };

    /**
     * Styles copied from the shipped sidebar section header and row patterns,
     * expressed only through `--dsw-alias-*` theme tokens so light and dark
     * themes stay consistent. Classes are namespaced under `dsh-worktable`.
     *
     * The first rule is the structural part: the sidebar shell declares only a
     * single `sidebar.workspaces` seat and no sibling section list, so a pane
     * below it can only start in the foot. Flattening the foot and its action
     * list (`display: contents`) promotes this pane to a direct child of the
     * sidebar column, where it shares the body height with the Workspaces
     * region. Slot outlets already render as `display: contents`, hence the two
     * DOM levels in the selectors.
     */
    const CSS = [
      'div:has(> [data-slot="sidebar.footer.action"] > .dsh-worktable),div:has(> * > [data-slot="sidebar.footer.action"] > .dsh-worktable){display:contents}',
      '.dsh-worktable{box-sizing:border-box;display:flex;flex:1 1 0;flex-direction:column;width:100%;min-width:0;min-height:0;font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary)}',
      '.dsh-worktable__header{box-sizing:border-box;display:flex;flex:none;align-items:center;gap:4px;width:100%;min-width:0;height:36px;padding:0 4px;color:var(--dsw-alias-label-tertiary)}',
      '.dsh-worktable__label{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',
      '.dsh-worktable__add{box-sizing:border-box;display:inline-flex;flex:none;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.dsh-worktable__add:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dsh-worktable__add:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}',
      '.dsh-worktable__list{box-sizing:border-box;display:flex;flex:1 1 auto;flex-direction:column;min-height:0;overflow-y:auto;padding:0 0 8px}',
      '.dsh-worktable__empty{display:flex;flex:1;align-items:center;justify-content:center;padding:16px 12px;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:18px;text-align:center}',
    ].join('\n');

    /** Folder-with-plus glyph matching the shipped "Add workspace" icon size. */
    function addIcon() {
      return h(
        'svg',
        {
          viewBox: '0 0 16 16',
          width: 16,
          height: 16,
          fill: 'none',
          'aria-hidden': 'true',
        },
        h('path', {
          d: 'M1.75 4.25c0-.55.45-1 1-1h3.06c.28 0 .55.12.74.33l1.1 1.28h5.6c.55 0 1 .45 1 1v6.14c0 .55-.45 1-1 1H2.75c-.55 0-1-.45-1-1V4.25Z',
          stroke: 'currentColor',
          strokeWidth: 1.2,
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M8 7.4v3.4M6.3 9.1h3.4',
          stroke: 'currentColor',
          strokeWidth: 1.2,
          strokeLinecap: 'round',
        }),
      );
    }

    /**
     * Creation is the next milestone; the button exists now so the pane header
     * matches the Workspace header, and pressing it deliberately does nothing.
     */
    function requestAddWorktable() {}

    /**
     * The Worktable pane: a static header plus the list area.
     *
     * @param props - the slot's `wide` owner prop (`false` in the 56px rail)
     *   and the locale-injected `t` seat.
     * @returns the pane, or null while the sidebar is collapsed to its rail.
     */
    function WorktableSection({ wide, t }) {
      // The rail has no room for a half-height pane.
      if (!wide) return null;

      return h(
        'div',
        { className: 'dsh-worktable', 'data-worktable': 'section' },
        h('style', { key: 'styles' }, CSS),
        h(
          'div',
          { className: 'dsh-worktable__header' },
          h('span', { className: 'dsh-worktable__label' }, t('title')),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-worktable__add',
              'aria-label': t('add'),
              title: t('add'),
              onClick: requestAddWorktable,
            },
            addIcon(),
          ),
        ),
        h(
          'div',
          {
            className: 'dsh-worktable__list',
            role: 'group',
            'aria-label': t('title'),
          },
          h('div', { className: 'dsh-worktable__empty' }, t('empty')),
        ),
      );
    }

    WorktableSection.displayName = 'WorktableSection';

    /** Services the Client half needs; without them the entry stays inactive. */
    const inject = ['slots', 'locale'];

    /**
     * Registers the dictionaries and the sidebar-foot entry.
     *
     * @param ctx - the Client root context.
     */
    function apply(ctx) {
      ctx.effect(
        () => ctx.locale.register(NS, { zh, en }),
        'dsh-worktable: dictionaries',
      );

      ctx.slots.inject('sidebar.footer.action', () =>
        ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'dsh-worktable',
            order: 30,
            locale: NS,
          },
          WorktableSection,
        ),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
