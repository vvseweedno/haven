"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Command,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  journeyStages,
  navGroups,
  navigationContext,
  primaryNav,
} from "@/lib/navigation";
import { WorkspaceProvider, useWorkspace } from "./Workspace";
import { PointerAura } from "./PointerAura";
import { LocaleProvider, localize, useLocale } from "./LocaleContext";
import { GrowthJourney } from "./GrowthJourney";
import { MeasurementPanel } from "./MeasurementPanel";
import { MeasurementProvider } from "./MeasurementProvider";

const SearchDialog = dynamic(() => import("./SearchDialog"), { ssr: false });

function matchesRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemIsActive(pathname: string, href: string) {
  return matchesRoute(pathname, href);
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);
  const [dark, setDark] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        navGroups.map((group) => [
          group.id,
          group.items.some((item) => matchesRoute(pathname, item.href)),
        ]),
      ),
  );
  const { saved } = useWorkspace();
  const menuButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const keyboardNavigation = useRef(false);
  useEffect(() => {
    try {
      const value = localStorage.getItem("haven-theme") === "dark";
      setDark(value);
      document.documentElement.dataset.theme = value ? "dark" : "light";
    } catch {
      /* Default to light when storage is unavailable. */
    }
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSkipVisible(false);
    keyboardNavigation.current = false;
  }, [pathname]);
  useEffect(() => {
    const markKeyboardNavigation = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        keyboardNavigation.current = true;
      }
    };
    const clearKeyboardNavigation = () => {
      keyboardNavigation.current = false;
      setSkipVisible(false);
    };
    window.addEventListener("keydown", markKeyboardNavigation);
    window.addEventListener("pointerdown", clearKeyboardNavigation);
    return () => {
      window.removeEventListener("keydown", markKeyboardNavigation);
      window.removeEventListener("pointerdown", clearKeyboardNavigation);
    };
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.current
      ?.querySelector<HTMLButtonElement>(".sidebar-close")
      ?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const items = Array.from(
          sidebar.current?.querySelectorAll<HTMLElement>(
            "a, button, summary",
          ) || [],
        ).filter((el) => el.offsetParent !== null);
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handle);
    };
  }, [mobileOpen]);
  useEffect(() => {
    const activeGroup = navGroups.find((group) =>
      group.items.some((item) => matchesRoute(pathname, item.href)),
    );
    if (!activeGroup) return;
    setExpandedGroups((current) =>
      current[activeGroup.id]
        ? current
        : { ...current, [activeGroup.id]: true },
    );
  }, [pathname]);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("haven-theme", next ? "dark" : "light");
    } catch {
      /* The current theme still applies to the session. */
    }
  };
  const currentNavigation = navigationContext(pathname);
  const labelFor = (label: { en: string; ru: string }) => label[locale];
  const closeMobile = () => {
    setMobileOpen(false);
    menuButton.current?.focus();
  };
  const focusMain = () => {
    keyboardNavigation.current = false;
    setSkipVisible(false);
    requestAnimationFrame(() => {
      document.getElementById("main")?.focus();
    });
  };
  return (
    <>
      <PointerAura />
      <a
        className={`skip-link ${skipVisible ? "is-visible" : ""}`}
        href="#main"
        onBlur={() => setSkipVisible(false)}
        onClick={focusMain}
        onFocus={() => setSkipVisible(keyboardNavigation.current)}
      >
        {localize(locale, "Skip to content", "Перейти к содержимому")}
      </a>
      {mobileOpen && <div className="sidebar-backdrop" onClick={closeMobile} />}
      <aside
        ref={sidebar}
        id="sidebar"
        className={`sidebar ${mobileOpen ? "is-open" : ""}`}
        aria-label={localize(locale, "Workspace navigation", "Навигация по HAVEN")}
      >
        <div className="sidebar-brand-row">
          <Link
            prefetch={false}
            href="/"
            className="brand"
            aria-label={localize(locale, "HAVEN home", "Главная HAVEN")}
            data-measure="navigation_select"
            data-measure-context="brand"
          >
            <span className="haven-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <strong>HAVEN</strong>
          </Link>
          <button
            className="icon-button sidebar-close"
            onClick={closeMobile}
            aria-label={localize(locale, "Close navigation", "Закрыть навигацию")}
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">
          <span className="node-avatar">a</span>
          <span>
            <strong>{localize(locale, "Evaluation prototype", "Прототип для оценки")}</strong>
            <small>{localize(locale, "Local evidence workspace", "Локальное пространство доказательств")}</small>
          </span>
        </div>
          <button
            type="button"
            className="sidebar-search"
            data-measure="search_open"
            data-measure-context="sidebar"
          onClick={() => {
            setMobileOpen(false);
            setSearchOpen(true);
          }}
        >
          <Search size={16} />
          <span>{localize(locale, "Search HAVEN", "Поиск по HAVEN")}</span>
          <Command size={13} />
        </button>
        <nav
          className="sidebar-nav"
          aria-label={localize(locale, "Primary navigation", "Основная навигация")}
        >
          <span className="nav-heading">
            {localize(locale, "Decision path", "Путь решения")}
          </span>
          <div className="sidebar-primary-links">
            {primaryNav.map((item) => {
              const active = itemIsActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  prefetch={false}
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link ${active ? "active" : ""}`}
                  data-measure="navigation_select"
                  data-measure-context="primary"
                  data-measure-step={item.href.slice(1) || "home"}
                >
                  <Icon size={18} />
                  <span>{labelFor(item.label)}</span>

                </Link>
              );
            })}
          </div>
          <span className="nav-heading">
            {localize(locale, "Reference areas", "Справочные разделы")}
          </span>
          <div className="sidebar-nav-groups">
            {navGroups.map((group) => {
              const GroupIcon = group.icon;
              const groupActive = group.items.some((item) =>
                matchesRoute(pathname, item.href),
              );
              return (
                <details
                  className={`sidebar-nav-group ${groupActive ? "has-active-route" : ""}`}
                  key={group.id}
                  open={expandedGroups[group.id]}
                  onToggle={(event) => {
                    const open = event.currentTarget.open;
                    setExpandedGroups((current) =>
                      current[group.id] === open
                        ? current
                        : { ...current, [group.id]: open },
                    );
                  }}
                >
                  <summary className="sidebar-nav-group-summary">
                    <GroupIcon size={17} aria-hidden="true" />
                    <span>{labelFor(group.label)}</span>
                    <ChevronDown size={15} aria-hidden="true" />
                  </summary>
                  <div className="sidebar-nav-group-items">
                    {group.items.map((item) => {
                      const active = matchesRoute(pathname, item.href);
                      const Icon = item.icon;
                      return (
                        <Link
                          prefetch={false}
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`nav-link nav-link-secondary ${active ? "active" : ""}`}
                          data-measure="navigation_select"
                          data-measure-context="secondary"
                          data-measure-step={item.href.slice(1) || "home"}
                        >
                          <Icon size={17} />
                          <span>{labelFor(item.label)}</span>
                          {item.href === "/saved" && saved.length > 0 && (
                            <small>{saved.length}</small>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </nav>
        <div className="sidebar-bottom">
          <GrowthJourney pathname={pathname} />
          <Link
            prefetch={false}
            className="connect-link"
            href="/delivery"
            onClick={() => setMobileOpen(false)}
            data-measure="pilot_readiness_opened"
            data-measure-context="sidebar"
          >
            <ClipboardCheck size={17} />
            {localize(locale, "Review pilot readiness", "Проверить готовность к пилоту")}
            <ArrowUpRight size={15} />
          </Link>
          <div className="sidebar-status">
            <span className="status-dot" />
            <span>{localize(locale, "Local prototype", "Локальный прототип")}</span>
            <span>v1.2</span>
          </div>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <nav
            className="breadcrumbs"
            aria-label={localize(locale, "Breadcrumb", "Хлебные крошки")}
          >
            <button
              ref={menuButton}
              className="icon-button mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label={localize(locale, "Open navigation", "Открыть навигацию")}
              aria-expanded={mobileOpen}
              aria-controls="sidebar"
            >
              <Menu size={19} />
            </button>
            <Link prefetch={false} href="/" className="crumb-root">
              HAVEN
            </Link>
            <span className="crumb-divider" aria-hidden="true">/</span>
            <span className="crumb-section">{labelFor(currentNavigation.section)}</span>
            {pathname !== "/" && (
              <>
                <span className="crumb-divider" aria-hidden="true">/</span>
                <span aria-current="page">{labelFor(currentNavigation.item)}</span>
              </>
            )}
          </nav>
          <div className="topbar-actions">
            <span className="preview-label">
              <CircleDot size={13} />
              {localize(locale, "Demo data", "Демо-данные")}
            </span>
            <div className="language-switch" role="group" aria-label={localize(locale, "Language", "Язык")}>
              <button
                className={locale === "en" ? "active" : ""}
                onClick={() => setLocale("en")}
                aria-label={localize(locale, "Switch to English", "Переключить на английский")}
                aria-pressed={locale === "en"}
                data-measure="locale_select"
                data-measure-context="en"
              >
                EN
              </button>
              <button
                className={locale === "ru" ? "active" : ""}
                onClick={() => setLocale("ru")}
                aria-label={localize(locale, "Switch to Russian", "Переключить на русский")}
                aria-pressed={locale === "ru"}
                data-measure="locale_select"
                data-measure-context="ru"
              >
                RU
              </button>
            </div>
            <button
              className="icon-button"
              onClick={() => setSearchOpen(true)}
              title={localize(locale, "Search", "Поиск")}
              aria-label={localize(locale, "Open search", "Открыть поиск")}
              data-measure="search_open"
              data-measure-context="topbar"
            >
              <Search size={18} />
            </button>
            <button
              className="icon-button"
              onClick={toggleTheme}
              title={dark ? localize(locale, "Light theme", "Светлая тема") : localize(locale, "Dark theme", "Тёмная тема")}
              aria-label={localize(locale, "Toggle color theme", "Переключить тему")}
              data-measure="theme_toggle"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <nav
          className="journey-rail"
          aria-label={localize(locale, "HAVEN journey", "Путь HAVEN")}
        >
          <ol className="journey-rail-list">
            {journeyStages.map((stage, index) => {
              const active = stage.routes.some((route) =>
                matchesRoute(pathname, route),
              );
              const Icon = stage.icon;
              return (
                <li
                  className={`journey-rail-step ${active ? "active" : ""}`}
                  key={stage.id}
                >
                  <Link
                    prefetch={false}
                    href={stage.href}
                    className="journey-rail-link"
                    aria-current={active ? "step" : undefined}
                    data-measure="journey_step_select"
                    data-measure-step={stage.id}
                  >
                    <span className="journey-rail-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon size={16} aria-hidden="true" />
                    <span className="journey-rail-label">
                      {labelFor(stage.label)}
                    </span>
                  </Link>
                  {index < journeyStages.length - 1 && (
                    <ChevronRight
                      className="journey-rail-connector"
                      size={15}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <MeasurementPanel />
        <footer className="site-footer">
          <span>
            <span className="status-dot" />
            HAVEN / {localize(locale, "Local evaluation prototype", "Локальный прототип оценки")}
          </span>
          <div>
            <Link prefetch={false} href="/trust">
              {localize(locale, "Trust & status", "Доверие и статус")}
            </Link>
            <Link prefetch={false} href="/protocol">
              {localize(locale, "Protocol & API", "Протокол и API")}
            </Link>
            <Link prefetch={false} href="/.well-known/ard.json">
              {localize(locale, "Machine entrance", "Вход для машин")}
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </footer>
      </div>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <WorkspaceProvider>
        <MeasurementProvider>
          <Shell>{children}</Shell>
        </MeasurementProvider>
      </WorkspaceProvider>
    </LocaleProvider>
  );
}
