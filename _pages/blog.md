---
layout: default
permalink: /blog/
title: blog
nav: true
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 5
  sort_field: date
  sort_reverse: true
  trail:
    before: 1
    after: 3
---

<div class="post">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}
  <div class="header-bar">
    <h1 class="blog-title">
      {% assign words = site.blog_name | split: " " %}
      {% assign first_word = words[0] %}
      {% assign remaining_words = words | slice: 1, words.size %}
      {% if words.size <= 2 %}
        <span class="first-word">{{ first_word }}</span>
        {% if remaining_words.size > 0 %}
          <span class="remaining-words">{{ remaining_words | join: " " }}</span>
        {% endif %}
      {% else %}
        {% for word in words %}
          <span>{{ word }}</span>{% unless forloop.last %} {% endunless %}
        {% endfor %}
      {% endif %}
    </h1>
    <h2 class="blog-description">{{ site.blog_description }}</h2>
  </div>
{% endif %}

{% if site.display_tags and site.display_tags.size > 0 or site.display_categories and site.display_categories.size > 0 %}
  <div class="tag-category-list">
    <ul class="p-0 m-0 d-flex flex-wrap align-items-center">
      {% for tag in site.display_tags %}
        <li class="tag-item">
          <i class="fa-solid fa-hashtag fa-sm"></i> 
          <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a>
        </li>
        {% unless forloop.last %}
          <li class="separator">&bull;</li>
        {% endunless %}
      {% endfor %}
      {% if site.display_categories.size > 0 and site.display_tags.size > 0 %}
        <li class="separator">&bull;</li>
      {% endif %}
      {% for category in site.display_categories %}
        <li class="category-item">
          <i class="fa-solid fa-tag fa-sm"></i> 
          <a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">{{ category }}</a>
        </li>
        {% unless forloop.last %}
          <li class="separator">&bull;</li>
        {% endunless %}
      {% endfor %}
    </ul>
  </div>
{% endif %}

{% assign featured_posts = site.posts | where: "featured", "true" %}
{% if featured_posts.size > 0 %}
<br>

<div class="container-fluid featured-posts">
  {% assign is_even = featured_posts.size | modulo: 2 %}
  <div class="row row-cols-2 row-cols-md-2 row-cols-lg-{% if featured_posts.size <= 2 or is_even == 0 %}2{% else %}3{% endif %}">
    {% for post in featured_posts %}
    <div class="col mb-4">
      <a href="{{ post.url | relative_url }}">
        <div class="card hoverable h-100">
          <div class="row g-0 h-100">
            <div class="col-12">
              <div class="card-body d-flex flex-column">
                <div class="float-right">
                  <i class="fa-solid fa-thumbtack fa-xs"></i>
                </div>
                <h3 class="card-title text-lowercase">{{ post.title }}</h3>
                <p class="card-text flex-grow-1">{{ post.description }}</p>

                {% if post.external_source == blank %}
                  {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
                {% else %}
                  {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
                {% endif %}
                {% assign year = post.date | date: "%Y" %}

                <p class="post-meta mt-auto">
                  {{ read_time }} min read &nbsp; &middot; &nbsp;
                  <a href="{{ year | prepend: '/blog/' | relative_url }}">
                    <i class="fa-solid fa-calendar fa-sm"></i> {{ year }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
    {% endfor %}
  </div>
</div>
<hr>

{% endif %}

<ul class="post-list">

  {% if page.pagination.enabled %}
    {% assign postlist = paginator.posts %}
  {% else %}
    {% assign postlist = site.posts %}
  {% endif %}

  {% for post in postlist %}

  {% if post.external_source == blank %}
    {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
  {% else %}
    {% assign read_time = post.feed_content | strip_html | number_of_type | divided_by: 180 | plus: 1 %}
  {% endif %}
  {% assign year = post.date | date: "%Y" %}
  {% assign tags = post.tags | join: "" %}
  {% assign categories = post.categories | join: "" %}

  <li class="post-item">

    {% if post.thumbnail %}
    <div class="row">
      <div class="col-12 col-md-9 order-2 order-md-1">
    {% endif %}
        <h3 class="post-title-main">
        {% if post.redirect == blank %}
          <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% elsif post.redirect contains '://' %}
          <a class="post-title" href="{{ post.redirect }}" target="_blank">{{ post.link_title | default: post.title }}</a>
          <svg width="1.5rem" height="1.5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        {% else %}
          <a class="post-title" href="{{ post.redirect | relative_url }}">{{ post.title }}</a>
        {% endif %}
      </h3>
      <p class="post-description">{{ post.description }}</p>
      <p class="post-meta">
        {{ read_time }} min read &nbsp; &middot; &nbsp;
        {{ post.date | date: '%B %d, %Y' }}
        {% if post.external_source %}
        &nbsp; &middot; &nbsp; {{ post.external_source }}
        {% endif %}
      </p>
      <p class="post-tags">
        <a href="{{ year | prepend: '/blog/' | relative_url }}">
          <i class="fa-compat fa-calendar fa-sm"></i> {{ year }}
        </a>

        {% if tags != "" %}
        &nbsp; &middot; &nbsp;
          {% for tag in post.tags %}
          <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">
            <i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}</a>
            {% unless forloop.last %}
              &nbsp;
            {% endunrelse %}
            {% endfor %}
        {% endif %}

        {% if categories != "" %}
        &nbsp; &middot; &nbsp;
          {% for category in post.categories %}
          <a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">
            <i class="fa-solid fa-tag fa-sm"></i> {{ category }}</a>
            {% unless forloop.last %}
              &nbsp;
            {% endunless %}
            {% endfor %}
        {% endif %}
      </p>

    {% if post.thumbnail %}
      </div>
      <div class="col-12 col-md-3 order-1 order-md-2 mb-3 mb-2">
        <img class="card-img img-fluid" src="{{ post.thumbnail | relative_url }}" style="object-fit: cover; width: 100%; height: 200px;" alt="{{ post.title | escape }}">
      </div>
    </div>
    {% endif %}
  </li>

  {% endfor %}

</ul>

{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}

</div>

<style>
/* =================  GLOBAL ================= */
.blog-title {
  font-size: 2rem;
  white-space: nowrap;
  overflow-wrap: normal;
  line-height: 1.2;
  text-align: center;
}

.blog-title .first-word,
.blog-title .remaining-words {
  display: inline-block;
}

.blog-description {
  font-size: 1.1rem;
  word-wrap: break-word;
  line-height: 1.3;
}

/* =================  MOBILE FIRST (≤ 576px)  ================= */
.blog-title {
  font-size: 1.6rem;
  white-space: normal;
}

.blog-title .first-word,
.blog-title .remaining-words {
  display: block;
}

.featured-posts .col {
  flex: 0 0 50%;
  max-width: 50%;
}

.featured-posts .card-title { 
  font-size: 1rem; 
}

.featured-posts .card-text,
.featured-posts .post-meta { 
  font-size: 0.78rem; 
}

/* =================  POST LIST TYPOGRAPHY  ================= */
.post-title-main { 
  font-size: 1.3rem; 
  line-height: 1.3; 
  margin-bottom: 0.5rem; 
}

.post-title { 
  word-wrap: break-word; 
  hyphens: auto; 
}

.post-description { 
  font-size: 0.95rem; 
  line-height: 1.4; 
  margin-bottom: 0.5rem; 
}

.post-meta { 
  font-size: 0.85rem; 
  color: #666; 
  margin-bottom: 0.3rem; 
}

.post-tags { 
  font-size: 0.8rem; 
  margin-bottom: 1rem; 
}

.post-item { 
  margin-bottom: 2rem; 
  padding-bottom: 1.5rem; 
  border-bottom: 1px solid #eee; 
}

/* =================  TAG/CATEGORY LIST  ================= */
.tag-category-list ul { 
  list-style: none; 
  gap: 0.5rem; 
}

.tag-item,
.category-item { 
  white-space: nowrap; 
}

.separator { 
  color: #999; 
  margin: 0 0.3rem; 
}

/* =================  CARD STYLES  ================= */
.card-title { 
  font-size: 1.1rem; 
  line-height: 1.3; 
  word-wrap: break-word; 
}

.card-text { 
  font-size: 0.85rem; 
  line-height: 1.4; 
}

.featured-posts .col { 
  padding-left: 0.5rem; 
  padding-right: 0.5rem; 
}

/* =================  TABLET (≥ 768px)  ================= */
@media (min-width: 768px) {
  .blog-title {
    font-size: 2.2rem;
    white-space: nowrap;
  }
  
  .blog-title .first-word,
  .blog-title .remaining-words {
    display: inline-block;
  }
  
  .blog-description { font-size: 1.3rem; }
  .post-title-main { font-size: 1.5rem; }
  .post-description { font-size: 1rem; }
  .post-meta { font-size: 0.9rem; }
  .post-tags { font-size: 0.85rem; }
  .card-title { font-size: 1.2rem; }
  .card-text { font-size: 0.9rem; }
  .featured-posts .col { 
    padding-left: 0.75rem; 
    padding-right: 0.75rem; 
  }
}

/* =================  DESKTOP (≥ 1024px)  ================= */
@media (min-width: 1024px) {
  .blog-title { font-size: 2.5rem; }
  .blog-description { font-size: 1.4rem; }
  .post-title-main { font-size: 1.6rem; }
  .post-description { font-size: 1.05rem; }
  .post-meta { font-size: 0.95rem; }
  .post-tags { font-size: 0.9rem; }
  .featured-posts .col { 
    padding-left: 1rem; 
    ght: 1rem; 
  }
}

/* =================  DARK THEME  ================= */
@media (prefers-color-scheme: dark) {
  .post-meta { color: #aaa; }
  .separator { color: #777; }
  .post-item { border-bottom-color: #333; }
}
</style>
