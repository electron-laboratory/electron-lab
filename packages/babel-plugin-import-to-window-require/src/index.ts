import type { NodePath } from '@babel/traverse';
import type { ImportDeclaration } from '@babel/types';

type Opts = {
  packages: string[];
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function({ types: t }) {
  return {
    visitor: {
      ImportDeclaration: {
        exit(path: NodePath<ImportDeclaration>, { opts }: { opts: Opts }): void {
          const { packages } = opts;

          const { specifiers, source } = path.node;

          if (!specifiers.length || !packages.includes(source.value)) {
            return;
          }
          const importSpecifiers = [];
          let defaultImport;
          specifiers.forEach(spec => {
            if (t.isImportDefaultSpecifier(spec)) {
              const {
                local: { name },
              } = spec;
              defaultImport = t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(name),
                  t.callExpression(
                    t.memberExpression(t.identifier('window'), t.identifier('require')),
                    [t.stringLiteral(source.value)],
                  ),
                ),
              ]);
            } else if (t.isImportSpecifier(spec)) {
              importSpecifiers.push(spec);
            }
          });
          const extractImport =
            importSpecifiers.length > 0
              ? t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.objectPattern([
                      ...importSpecifiers.map(spec => {
                        const {
                          imported: { name: importedName },
                          local: { name: localName },
                        } = spec;
                        return t.objectProperty(
                          t.identifier(importedName),
                          t.identifier(localName),
                        );
                      }),
                    ]),
                    t.callExpression(
                      t.memberExpression(t.identifier('window'), t.identifier('require')),
                      [t.stringLiteral(source.value)],
                    ),
                  ),
                ])
              : undefined;

          path.replaceWithMultiple([defaultImport, extractImport].filter(Boolean));
        },
      },
    },
  };
}
