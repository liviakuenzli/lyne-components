export class CSSVariableContext<T> {
  private _tagName: string;
  private _styles?: CSSStyleDeclaration;

  public constructor(private _instance: T, host: HTMLElement) {
    this._tagName = host.tagName.toLowerCase();
    if (typeof getComputedStyle === 'function') {
      this._styles = getComputedStyle(host);
    }
  }

  public mutateStringProperties<K extends keyof T>(...names: K[]): this {
    for (const name of names) {
      this.mutateStringProperty(name);
    }
    return this;
  }

  public mutateStringProperty<K extends keyof T>(name: K): this {
    const value = this._readPropertyValue(name);
    if (value) {
      this._instance[name] = value as any;
    }
    return this;
  }

  public mutateBooleanProperties<K extends keyof T>(...names: K[]): this {
    for (const name of names) {
      this.mutateBooleanProperty(name);
    }
    return this;
  }

  public mutateBooleanProperty<K extends keyof T>(name: K): this {
    const value = this._readPropertyValue(name);
    if (value === 'true' || value === 'false') {
      this._instance[name] = (value === 'true') as any;
    }
    return this;
  }

  private _readPropertyValue(name: string | number | symbol): string {
    const key = name
      .toString()
      .split('')
      .map((char, index) =>
        char.toUpperCase() === char ? `${index !== 0 ? '-' : ''}${char.toLowerCase()}` : char
      )
      .join('');
    return (
      this._styles.getPropertyValue(`--_${this._tagName}__${key}`).trim() ||
      this._styles.getPropertyValue(`--_sbb__${key}`).trim()
    );
  }
}
