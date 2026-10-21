/**
 * Worktable — browser half.
 *
 * Registers the first-level "Worktable" entry below the Workspaces region in
 * the left sidebar (`sidebar.footer.action`, the side-bar foot above Settings).
 * The entry mirrors the shipped Workspace section header: a localized label on
 * the left and the same add icon button on the right. Clicking the entry body
 * expands or collapses the Worktable list; with no Worktables yet the expanded
 * area shows the localized "Empty" placeholder.
 *
 * Copy is routed through the Client locale service so both the visible title
 * and the tooltips follow the Harness language setting.
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
    /** DOM id shared by the toggle button and the collapsible list. */
    const LIST_ID = 'dsh-worktable-list';

    /** Simplified Chinese dictionary (the key-set source of truth). */
    const zh = {
      title: '工作台',
      add: '添加工作台',
      empty: '空',
      expand: '展开工作台',
      collapse: '收起工作台',
    };

    /** English dictionary, checked complete against the zh key set. */
    const en = {
      title: 'Worktable',
      add: 'Add worktable',
      empty: 'Empty',
      expand: 'Expand Worktable',
      collapse: 'Collapse Worktable',
    };

    /**
     * Styles copied from the shipped sidebar section header and row patterns,
     * expressed only through `--dsw-alias-*` theme tokens so light and dark
     * themes stay consistent. Classes are namespaced under `dsh-worktable`.
     */
    const CSS = [
      // The sidebar foot is a flex row shared with other actions. A full-width
      // entry (this section) must claim its own line so a full-width sibling
      // such as an activity strip keeps its width instead of being squeezed.
      // Slot outlets render as `display:contents`, so the row is two DOM levels
      // above this entry.
      ':has(> [data-slot="sidebar.footer.action"] > .dsh-worktable){flex-wrap:wrap}',
      '.dsh-worktable{box-sizing:border-box;display:flex;flex:0 0 100%;flex-direction:column;width:100%;min-width:0;margin:2px 0 2px;font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary)}',
      '.dsh-worktable__header{box-sizing:border-box;display:flex;align-items:center;gap:4px;width:100%;min-width:0;height:36px;padding:0 0 0 0;border-radius:var(--dsw-radius-md);color:var(--dsw-alias-label-tertiary)}',
      '.dsh-worktable__toggle{box-sizing:border-box;display:flex;align-items:center;gap:6px;flex:1;min-width:0;height:28px;padding:0 4px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.dsh-worktable__toggle:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}',
      '.dsh-worktable__toggle:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}',
      '.dsh-worktable__chevron{display:inline-flex;flex:none;align-items:center;justify-content:center;width:16px;height:16px;color:var(--dsw-alias-label-caption);transition:transform .15s var(--ds-ease-in-out,ease)}',
      '.dsh-worktable__chevron[data-expanded="true"]{transform:rotate(90deg)}',
      '.dsh-worktable__label{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',
      '.dsh-worktable__add{box-sizing:border-box;display:inline-flex;flex:none;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.dsh-worktable__add:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dsh-worktable__add:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}',
      '.dsh-worktable__list{display:flex;flex-direction:column;gap:2px;min-width:0;padding:0 0 4px}',
      '.dsh-worktable__list[hidden]{display:none}',
      '.dsh-worktable__empty{padding:10px 12px;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:18px}',
      '@media (prefers-reduced-motion:reduce){.dsh-worktable__chevron{transition:none}}',
    ].join('\n');

    /** Chevron pointing right; CSS rotates it while the list is expanded. */
    function chevronIcon() {
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
          d: 'M6 3.5 10.5 8 6 12.5',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

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
     * Creation is the next milestone; the button exists now so the entry
     * matches the Workspace header, and pressing it deliberately does nothing.
     */
    function requestAddWorktable() {}

    /**
     * The sidebar-foot entry: a section header plus the collapsible list.
     *
     * @param props - the slot's `wide` owner prop (`false` in the 56px rail)
     *   and the locale-injected `t` seat.
     * @returns the entry, or null while the sidebar is collapsed to its rail.
     */
    function WorktableSection({ wide, t }) {
      const [expanded, setExpanded] = React.useState(true);

      // Hooks above stay unconditional; the rail has no room for the section.
      if (!wide) return null;

      return h(
        'div',
        { className: 'dsh-worktable', 'data-worktable': 'section' },
        h('style', { key: 'styles' }, CSS),
        h(
          'div',
          { className: 'dsh-worktable__header' },
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-worktable__toggle',
              'aria-expanded': expanded,
              'aria-controls': LIST_ID,
              title: expanded ? t('collapse') : t('expand'),
              onClick: () => {
                setExpanded((value) => !value);
              },
            },
            h(
              'span',
              {
                className: 'dsh-worktable__chevron',
                'data-expanded': expanded ? 'true' : 'false',
                'aria-hidden': 'true',
              },
              chevronIcon(),
            ),
            h('span', { className: 'dsh-worktable__label' }, t('title')),
          ),
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
            id: LIST_ID,
            className: 'dsh-worktable__list',
            role: 'group',
            'aria-label': t('title'),
            hidden: !expanded,
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
