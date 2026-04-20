const fs = require('fs');
const path = require('path');

const file1 = path.join(__dirname, 'src', 'app', '[locale]', 'organizations', 'page.tsx');
let content1 = fs.readFileSync(file1, 'utf8');

// Inject the useTranslations hook if not already there
if (!content1.includes('const t = useTranslations("Organizations");')) {
  content1 = content1.replace(
    'export default function OrganizationsPage() {',
    'export default function OrganizationsPage() {\n  const t = useTranslations("Organizations");'
  );
  if (!content1.includes('import { useTranslations }')) {
    content1 = content1.replace('import { Link } from "@/i18n/routing";', 'import { Link } from "@/i18n/routing";\nimport { useTranslations } from "next-intl";');
  }
}

// Replace strings
content1 = content1.replace(
  '<p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Обзор компаний</p>',
  '<p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{t("overview")}</p>'
).replace(
  '<h1 className="text-3xl font-black text-slate-900 mb-1">Компании</h1>',
  '<h1 className="text-3xl font-black text-slate-900 mb-1">{t("title")}</h1>'
).replace(
  '<p className="text-slate-500 text-sm mb-7">Познакомьтесь с лучшими работодателями на платформе</p>',
  '<p className="text-slate-500 text-sm mb-7">{t("subtitle")}</p>'
).replace(
  '<Input placeholder="Название компании..." leftIcon={<Search size={15} />} className="flex-1" />',
  '<Input placeholder={t("search_placeholder")} leftIcon={<Search size={15} />} className="flex-1" />'
).replace(
  '<Button className="flex-shrink-0"><Search size={15} />Найти</Button>',
  '<Button className="flex-shrink-0"><Search size={15} />{t("find")}</Button>'
).replace(
  '<EmptyState icon={<Building2 size={40} />} title="Компании не найдены" />',
  '<EmptyState icon={<Building2 size={40} />} title={t("not_found")} />'
).replace(
  '<p className="text-sm text-slate-500 mb-5">{data.totalCount} компаний</p>',
  '<p className="text-sm text-slate-500 mb-5">{t("companies_count", { count: data.totalCount })}</p>'
).replace(
  '<span className="text-xs font-semibold text-indigo-600">Подробнее</span>',
  '<span className="text-xs font-semibold text-indigo-600">{t("details")}</span>'
).replace(
  '<Button variant="outline" size="sm" disabled={!data.hasPrevious} onClick={() => setPage(p => p - 1)}>← Назад</Button>',
  '<Button variant="outline" size="sm" disabled={!data.hasPrevious} onClick={() => setPage(p => p - 1)}>{t("prev")}</Button>'
).replace(
  '<Button variant="outline" size="sm" disabled={!data.hasNext} onClick={() => setPage(p => p + 1)}>Вперед →</Button>',
  '<Button variant="outline" size="sm" disabled={!data.hasNext} onClick={() => setPage(p => p + 1)}>{t("next")}</Button>'
);

fs.writeFileSync(file1, content1, 'utf8');


const file2 = path.join(__dirname, 'src', 'app', '[locale]', 'organizations', '[id]', 'page.tsx');
let content2 = fs.readFileSync(file2, 'utf8');

if (!content2.includes('const t = useTranslations("Organizations");')) {
  // Try finding where to inject useTranslations
  // it's an async component or not? Wait, if it has `const { id } = React.use(params);`, we inject there
  content2 = content2.replace(
    /export default function OrgDetails\(\{\n\s*params,\n\}\: /g,
    'import { useTranslations } from "next-intl";\n\nexport default function OrgDetails({\n  params,\n}: '
  );
  
  content2 = content2.replace(
    'const id = (params as any).id;',
    'const id = (params as any).id;\n  const t = useTranslations("Organizations");'
  );
}

// Replace texts
content2 = content2.replace(
  'if (!org) return <><Header /><div className="p-8 text-center text-slate-500">Компания не найдена</div></>;',
  'if (!org) return <><Header /><div className="p-8 text-center text-slate-500">{t("not_found_single")}</div></>;'
).replace(
  '<ArrowLeft size={14} />Назад к компаниям',
  '<ArrowLeft size={14} />{t("back_to_list")}'
).replace(
  '<h2 className="text-lg font-bold text-slate-900 mb-3">О компании</h2>',
  '<h2 className="text-lg font-bold text-slate-900 mb-3">{t("about")}</h2>'
).replace(
  '<h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">',
  '<h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">'
).replace(
  'Открытые вакансии',
  '{t("open_jobs")}'
).replace(
  />Адрес<\/div>/g,
  '>{t("location")}</div>'
).replace(
  />Веб-сайт<\/div>/g,
  '>{t("website")}</div>'
).replace(
  />Телефон<\/div>/g,
  '>{t("phone")}</div>'
);

fs.writeFileSync(file2, content2, 'utf8');

const file3 = path.join(__dirname, 'src', 'app', '[locale]', 'notifications', 'page.tsx');
let content3 = fs.readFileSync(file3, 'utf8');

if (!content3.includes('const t = useTranslations("Notifications");')) {
  content3 = content3.replace(
    'export default function NotificationsPage() {',
    'export default function NotificationsPage() {\n  const t = useTranslations("Notifications");'
  );
  if (!content3.includes('import { useTranslations }')) {
    content3 = content3.replace('import { useAuthStore } from "@/store/AuthStore";', 'import { useAuthStore } from "@/store/AuthStore";\nimport { useTranslations } from "next-intl";');
  }
}

content3 = content3.replace(
  / toast\.success\("Ўчирилди"\);/g,
  ' toast.success(t("deleted"));'
).replace(
  /<h1 className="text-2xl font-black text-slate-900">Билдиришномалар<\/h1>/g,
  '<h1 className="text-2xl font-black text-slate-900">{t("title")}</h1>'
).replace(
  /Билдиришномалар/g, // Only text instances, but be careful with h1
  '{t("title")}'
).replace(
  /{t\("title"\)} йўқ/g,
  '{t("empty")}'
).replace(
  />Ҳаммасини ўқилди деб белгилаш<\/span>/g,
  '>{t("mark_all_read")}</span>'
).replace(
  /title="Билдиришномалар йўқ"/g,
  'title={t("empty")}'
).replace(
  /description="Янги билдиришномалар бу ерда кўринади"/g,
  'description={t("empty_desc")}'
).replace(
  /← Олдинги/g,
  '{t("prev")}'
).replace(
  /Кейинги →/g,
  '{t("next")}'
);

fs.writeFileSync(file3, content3, 'utf8');

console.log("Pages Fixed via Script");
